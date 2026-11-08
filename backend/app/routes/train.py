"""
train.py — Training router for the Face-X Siamese Network.

Endpoints
---------
POST /api/train/start   Start training (non-blocking)
GET  /api/train/stream  SSE stream of real-time training progress
GET  /api/train/status  Current training state + progress snapshot
"""

import os
# Ensure writable cache paths to avoid sandbox/permission errors
os.environ.setdefault("KERAS_HOME", "/tmp/.keras")
os.environ.setdefault("MPLCONFIGDIR", "/tmp/matplotlib")

import asyncio
import json
import logging
import queue
import random
import threading
import time
from typing import Generator

import numpy as np
from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.config import LFW_DIR, MODEL_PATH, REFERENCE_DIR
from app.services import model as model_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/train", tags=["train"])

# ── Shared training state ─────────────────────────────────────────────────────
_training_state: dict = {
    "state": "idle",   # idle | running | complete | error
    "progress": {},
    "queue": queue.Queue(),
}
_state_lock = threading.Lock()


# ─────────────────────────────────────────────────────────────────────────────
# Helper: push an event dict onto the queue and update progress snapshot
# ─────────────────────────────────────────────────────────────────────────────
def _push(event: dict) -> None:
    with _state_lock:
        _training_state["queue"].put(event)
        if event.get("type") == "epoch":
            _training_state["progress"] = {
                k: event[k]
                for k in ("epoch", "total_epochs", "loss", "val_loss",
                           "accuracy", "val_accuracy", "eta_seconds")
                if k in event
            }


# ─────────────────────────────────────────────────────────────────────────────
# Keras callback — runs inside the training thread
# ─────────────────────────────────────────────────────────────────────────────
def _make_callback(total_epochs: int, epoch_times: list):
    """
    Returns a Keras Callback class that pushes epoch events to the queue.
    Defined inside a function to avoid importing TF at module load time.
    """
    import tensorflow as tf

    class TrainingProgressCallback(tf.keras.callbacks.Callback):
        def on_train_begin(self, logs=None):
            _push({"type": "start", "total_epochs": total_epochs,
                   "message": "Training started"})

        def on_epoch_begin(self, epoch, logs=None):
            epoch_times.append(time.time())

        def on_epoch_end(self, epoch, logs=None):
            logs = logs or {}
            elapsed = time.time() - epoch_times[epoch]

            if len(epoch_times) > 1:
                avg = (time.time() - epoch_times[0]) / (epoch + 1)
            else:
                avg = elapsed
            eta = max(0.0, avg * (total_epochs - epoch - 1))

            _push({
                "type": "epoch",
                "epoch": epoch + 1,
                "total_epochs": total_epochs,
                "loss": round(float(logs.get("loss", 0.0)), 4),
                "val_loss": round(float(logs.get("val_loss", 0.0)), 4),
                "accuracy": round(float(logs.get("accuracy", logs.get("binary_accuracy", 0.0))), 4),
                "val_accuracy": round(float(logs.get("val_accuracy", logs.get("val_binary_accuracy", 0.0))), 4),
                "eta_seconds": round(eta, 1),
                "message": f"Epoch {epoch + 1}/{total_epochs} completed — loss: {float(logs.get('loss', 0)):.4f}",
            })

        def on_train_end(self, logs=None):
            pass

    return TrainingProgressCallback


# ─────────────────────────────────────────────────────────────────────────────
# Data helpers
# ─────────────────────────────────────────────────────────────────────────────
def _load_image(path: str) -> np.ndarray:
    """Load + resize + normalise an image to (100, 100, 3) float32."""
    from PIL import Image
    img = Image.open(path).convert("RGB").resize((100, 100))
    return np.array(img, dtype=np.float32) / 255.0


def _augment(img: np.ndarray) -> np.ndarray:
    """Return an augmented copy (random flip, brightness, slight contrast)."""
    aug = img.copy()
    if random.random() > 0.5:
        aug = np.fliplr(aug)
    brightness_factor = random.uniform(0.85, 1.15)
    aug = np.clip(aug * brightness_factor, 0.0, 1.0)
    return aug.astype(np.float32)


def _collect_lfw_paths(limit: int = 5000) -> list[str]:
    """Collect image paths from the LFW dataset tree."""
    paths: list[str] = []
    if not os.path.isdir(LFW_DIR):
        logger.warning("LFW directory not found: %s", LFW_DIR)
        return paths
    for root, _, files in os.walk(LFW_DIR):
        for fname in files:
            if fname.lower().endswith((".jpg", ".jpeg", ".png")):
                paths.append(os.path.join(root, fname))
                if len(paths) >= limit:
                    return paths
    return paths


def _collect_lfw_identity_pairs(target_pairs: int = 100) -> list[tuple[str, str]]:
    """Find pairs of images of the SAME person in LFW."""
    pairs: list[tuple[str, str]] = []
    if not os.path.isdir(LFW_DIR):
        return pairs
    try:
        entries = os.listdir(LFW_DIR)
        random.shuffle(entries)
        for person_dir in entries:
            full_dir = os.path.join(LFW_DIR, person_dir)
            if not os.path.isdir(full_dir):
                continue
            images = [
                os.path.join(full_dir, f)
                for f in os.listdir(full_dir)
                if f.lower().endswith((".jpg", ".jpeg", ".png"))
            ]
            if len(images) >= 2:
                random.shuffle(images)
                pairs.append((images[0], images[1]))
                if len(images) >= 4:
                    pairs.append((images[2], images[3]))
                if len(pairs) >= target_pairs:
                    break
    except Exception as exc:
        logger.warning("Error scanning LFW identities: %s", exc)
    return pairs


def _build_dataset(total_epochs: int):
    """
    Build numpy arrays of (anchors, positives/negatives, labels).
    Returns (X_anchor, X_pair, y) all as float32 numpy arrays.
    """
    _push({"type": "log", "message": "Preparing training dataset…"})

    # 1. Collect reference images
    ref_exts = (".jpg", ".jpeg", ".png")
    ref_paths: list[str] = []
    if os.path.isdir(REFERENCE_DIR):
        ref_paths = [
            os.path.join(REFERENCE_DIR, f)
            for f in os.listdir(REFERENCE_DIR)
            if f.lower().endswith(ref_exts)
        ]

    # 2. Collect LFW images
    lfw_paths = _collect_lfw_paths(limit=5000)
    if not lfw_paths:
        raise RuntimeError(f"LFW dataset not found. Expected directory: {LFW_DIR}")
    _push({"type": "log", "message": f"Found {len(lfw_paths)} LFW background faces."})

    anchors: list[np.ndarray] = []
    pairs: list[np.ndarray] = []
    labels: list[float] = []

    # If reference images exist, generate augmented pairs for the user
    if ref_paths:
        ref_imgs = [_load_image(p) for p in ref_paths]
        _push({"type": "log", "message": f"Loaded {len(ref_imgs)} registered user face(s). Augmenting…"})

        # Target around 80-100 positive pairs from reference images
        multipliers = max(10, 80 // max(len(ref_imgs), 1))
        for ref_img in ref_imgs:
            for _ in range(multipliers):
                # Positive pair: reference + augmented reference (or another reference)
                if len(ref_imgs) > 1 and random.random() > 0.4:
                    other_img = random.choice([x for x in ref_imgs if x is not ref_img])
                    pos_img = _augment(other_img)
                else:
                    pos_img = _augment(ref_img)

                anchors.append(ref_img)
                pairs.append(pos_img)
                labels.append(1.0)

                # Negative pair: reference + random stranger from LFW
                neg_path = random.choice(lfw_paths)
                neg_img = _load_image(neg_path)
                anchors.append(ref_img)
                pairs.append(neg_img)
                labels.append(0.0)

    # Also include LFW multi-image identity pairs to guarantee a robust universal metric
    lfw_same_person_pairs = _collect_lfw_identity_pairs(target_pairs=80)
    _push({"type": "log", "message": f"Added {len(lfw_same_person_pairs)} benchmark identity pairs from dataset."})

    for img1_path, img2_path in lfw_same_person_pairs:
        try:
            a_img = _load_image(img1_path)
            p_img = _load_image(img2_path)
            # Positive pair
            anchors.append(a_img)
            pairs.append(p_img)
            labels.append(1.0)

            # Negative pair
            n_path = random.choice(lfw_paths)
            n_img = _load_image(n_path)
            anchors.append(a_img)
            pairs.append(n_img)
            labels.append(0.0)
        except Exception:
            continue

    if not anchors:
        raise RuntimeError("No training images could be loaded to build the dataset.")

    # Shuffle dataset
    indices = list(range(len(labels)))
    random.shuffle(indices)

    X_anchor = np.array([anchors[i] for i in indices], dtype=np.float32)
    X_pair = np.array([pairs[i] for i in indices], dtype=np.float32)
    y = np.array([labels[i] for i in indices], dtype=np.float32)

    pos_count = int(np.sum(y == 1.0))
    neg_count = int(np.sum(y == 0.0))
    _push({
        "type": "log",
        "message": f"Dataset ready: {len(y)} image pairs ({pos_count} positive, {neg_count} negative).",
    })

    return X_anchor, X_pair, y


# ─────────────────────────────────────────────────────────────────────────────
# Model builders (matches notebook architecture)
# ─────────────────────────────────────────────────────────────────────────────
def _make_embedding(tf):
    inp = tf.keras.Input(shape=(100, 100, 3), name="input_image")
    x = tf.keras.layers.Conv2D(64, (10, 10), activation="relu")(inp)
    x = tf.keras.layers.MaxPooling2D(64, (2, 2), padding="same")(x)
    x = tf.keras.layers.Conv2D(128, (7, 7), activation="relu")(x)
    x = tf.keras.layers.MaxPooling2D(64, (2, 2), padding="same")(x)
    x = tf.keras.layers.Conv2D(128, (4, 4), activation="relu")(x)
    x = tf.keras.layers.MaxPooling2D(64, (2, 2), padding="same")(x)
    x = tf.keras.layers.Conv2D(256, (4, 4), activation="relu")(x)
    x = tf.keras.layers.Flatten()(x)
    x = tf.keras.layers.Dense(4096, activation="sigmoid")(x)
    return tf.keras.Model(inputs=[inp], outputs=[x], name="embedding")


def _make_l1_dist_layer(tf):
    class L1Dist(tf.keras.layers.Layer):
        def __init__(self, **kwargs):
            super().__init__(**kwargs)

        def call(self, inputs, *args, **kwargs):
            if args:
                inp, val = inputs, args[0]
            elif isinstance(inputs, (list, tuple)) and len(inputs) >= 2:
                inp, val = inputs[0], inputs[1]
            else:
                inp, val = inputs[0], inputs[1]
            if isinstance(inp, (list, tuple)):
                inp = inp[0]
            if isinstance(val, (list, tuple)):
                val = val[0]
            return tf.math.abs(inp - val)

    return L1Dist


def _make_siamese_model(tf, embedding, L1Dist):
    input_image = tf.keras.Input(name="input_img", shape=(100, 100, 3))
    validation_image = tf.keras.Input(name="validation_img", shape=(100, 100, 3))
    inp_embedding = embedding(input_image)
    val_embedding = embedding(validation_image)
    siamese_distance = L1Dist()([inp_embedding, val_embedding])
    classifier = tf.keras.layers.Dense(1, activation="sigmoid")(siamese_distance)
    return tf.keras.Model(
        inputs=[input_image, validation_image],
        outputs=classifier,
        name="SiameseNetwork",
    )


# ─────────────────────────────────────────────────────────────────────────────
# Core training worker — runs in a background thread
# ─────────────────────────────────────────────────────────────────────────────
def _run_training(epochs: int = 15, batch_size: int = 16) -> None:
    """
    Full training pipeline executed in a daemon thread.
    Pushes SSE events to _training_state["queue"] throughout.
    """
    with _state_lock:
        _training_state["state"] = "running"
        _training_state["progress"] = {}

    try:
        # 1. Import TensorFlow safely
        try:
            import tensorflow as tf
            # Disable Metal GPU to prevent driver crash with custom layers on Apple Silicon
            try:
                tf.config.set_visible_devices([], "GPU")
            except Exception:
                pass
        except ImportError as exc:
            raise RuntimeError(
                "TensorFlow is not installed in the Python environment. "
                "Install tensorflow-macos or tensorflow to enable training."
            ) from exc

        _push({"type": "log", "message": f"TensorFlow {tf.__version__} initialized."})

        # 2. Build dataset
        X_anchor, X_pair, y = _build_dataset(epochs)

        # 3. Build model
        _push({"type": "log", "message": "Constructing Siamese Neural Network…"})
        L1Dist = _make_l1_dist_layer(tf)
        embedding = _make_embedding(tf)
        siamese = _make_siamese_model(tf, embedding, L1Dist)
        siamese.compile(
            optimizer=tf.keras.optimizers.Adam(1e-4),
            loss=tf.losses.BinaryCrossentropy(),
            metrics=["accuracy"],
        )
        _push({"type": "log", "message": "Model compiled successfully. Beginning training…"})

        # 4. Train
        epoch_times: list[float] = []
        CallbackClass = _make_callback(epochs, epoch_times)

        siamese.fit(
            [X_anchor, X_pair],
            y,
            epochs=epochs,
            batch_size=batch_size,
            validation_split=0.2,
            callbacks=[CallbackClass()],
            verbose=0,
        )

        # 5. Save model
        os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
        siamese.save(MODEL_PATH)
        _push({"type": "log", "message": f"Model successfully saved to {MODEL_PATH}."})

        # 6. Hot-reload in memory
        _push({"type": "log", "message": "Hot-reloading model into verification service…"})
        model_service.load_model()
        _push({"type": "log", "message": "Model reloaded into memory. Ready for live verification!"})

        # 7. Complete event
        _push({
            "type": "complete",
            "message": "Training complete! Model saved and loaded.",
            "model_path": MODEL_PATH,
        })
        with _state_lock:
            _training_state["state"] = "complete"

    except Exception as exc:
        logger.exception("Training failed: %s", exc)
        _push({"type": "error", "message": str(exc)})
        with _state_lock:
            _training_state["state"] = "error"


# ─────────────────────────────────────────────────────────────────────────────
# Endpoints
# ─────────────────────────────────────────────────────────────────────────────

@router.post("/start")
async def start_training(epochs: int = 15, batch_size: int = 16):
    """
    Start training in a background thread.
    Returns immediately with {"started": true} or {"error": "already running"}.
    """
    with _state_lock:
        if _training_state["state"] == "running":
            return {"error": "already running"}
        _training_state["queue"] = queue.Queue()
        _training_state["state"] = "running"
        _training_state["progress"] = {}

    thread = threading.Thread(
        target=_run_training,
        kwargs={"epochs": epochs, "batch_size": batch_size},
        daemon=True,
        name="siamese-training",
    )
    thread.start()
    return {"started": True, "epochs": epochs, "batch_size": batch_size}


@router.get("/status")
async def training_status():
    """Return the current training state, latest progress, and model existence."""
    with _state_lock:
        return {
            "state": _training_state["state"],
            "progress": _training_state["progress"],
            "model_exists": os.path.exists(MODEL_PATH),
        }


@router.get("/stream")
async def stream_training():
    """
    Server-Sent Events stream.
    Drains the shared queue and forwards each event to the client.
    Closes automatically once a 'complete' or 'error' event is emitted.
    """

    async def event_generator() -> Generator[str, None, None]:
        await asyncio.sleep(0.1)

        while True:
            try:
                event = _training_state["queue"].get_nowait()
                payload = json.dumps(event)
                event_type = event.get("type", "message")
                if event_type == "error":
                    event_type = "error_event"
                # Send both event header and data for maximum client compatibility
                yield f"event: {event_type}\ndata: {payload}\n\n"
                yield f"data: {payload}\n\n"

                if event.get("type") in ("complete", "error"):
                    break
            except queue.Empty:
                with _state_lock:
                    state = _training_state["state"]
                if state in ("complete", "error") and _training_state["queue"].empty():
                    break
                yield ": keepalive\n\n"
                await asyncio.sleep(0.5)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
