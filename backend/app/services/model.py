"""
model.py — Siamese model loader and inference service.

Loads siamesemodelv2.h5 on startup (if present).
Falls back to the face_recognition library if the .h5 file is missing,
so the app works immediately without training.
"""

import os
import tempfile
import logging
import numpy as np
from app.config import MODEL_PATH, REFERENCE_DIR, DETECTION_THRESHOLD, VERIFICATION_THRESHOLD

logger = logging.getLogger(__name__)

# ── Lazy globals ──────────────────────────────────────────────────────────────
_siamese_model = None
_use_fallback = False   # True when falling back to face_recognition


# ── Custom layer needed to load the .h5 ──────────────────────────────────────
_cache_root = os.path.join(tempfile.gettempdir(), "face-x")
os.environ.setdefault("KERAS_HOME", os.path.join(_cache_root, "keras"))
os.environ.setdefault("MPLCONFIGDIR", os.path.join(_cache_root, "matplotlib"))


def _make_l1_dist_layer():
    """Return the L1Dist custom Keras layer class (matches the notebook & Keras 3 compatible)."""
    try:
        import tensorflow as tf

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
    except ImportError:
        return None


def load_model():
    """Load the Siamese model once at application startup."""
    global _siamese_model, _use_fallback

    if os.path.exists(MODEL_PATH):
        try:
            import tensorflow as tf
            try:
                tf.config.set_visible_devices([], "GPU")
            except Exception:
                pass
            L1Dist = _make_l1_dist_layer()
            _siamese_model = tf.keras.models.load_model(
                MODEL_PATH,
                custom_objects={
                    "L1Dist": L1Dist,
                    "BinaryCrossentropy": tf.losses.BinaryCrossentropy,
                },
            )
            _use_fallback = False
            logger.info("Siamese model loaded from %s", MODEL_PATH)
        except Exception as exc:
            logger.warning("Failed to load Siamese model: %s. Using fallback.", exc)
            _use_fallback = True
    else:
        logger.warning(
            "Model file not found at %s. Using face_recognition fallback.", MODEL_PATH
        )
        _use_fallback = True


def _verify_siamese(input_arr: np.ndarray, reference_arrs: list[np.ndarray]) -> dict:
    """Run verification using the trained Siamese model."""
    results = []
    for ref_arr in reference_arrs:
        inp = np.expand_dims(input_arr, axis=0)   # (1, 100, 100, 3)
        ref = np.expand_dims(ref_arr, axis=0)
        score = float(_siamese_model.predict([inp, ref], verbose=0)[0][0])
        results.append(score)

    match_count = sum(1 for s in results if s > DETECTION_THRESHOLD)
    total = len(results)
    proportion = match_count / total if total else 0.0
    verified = proportion >= VERIFICATION_THRESHOLD
    avg_score = float(np.mean(results)) if results else 0.0

    return {
        "verified": verified,
        "score": round(avg_score, 4),
        "match_count": match_count,
        "total": total,
        "message": "Identity verified" if verified else "Identity not confirmed",
        "engine": "siamese",
    }


def _verify_fallback(input_bytes: bytes, reference_bytes_list: list[bytes]) -> dict:
    """Run verification using the face_recognition library (pre-trained dlib model)."""
    try:
        import face_recognition
    except ImportError:
        return {
            "verified": False,
            "score": 0.0,
            "match_count": 0,
            "total": len(reference_bytes_list),
            "message": "face_recognition library not installed. Run: pip install face_recognition",
            "engine": "none",
        }

    import io
    from PIL import Image

    def to_rgb_array(raw_bytes):
        img = Image.open(io.BytesIO(raw_bytes)).convert("RGB")
        return np.array(img)

    live_rgb = to_rgb_array(input_bytes)
    live_encs = face_recognition.face_encodings(live_rgb)
    if not live_encs:
        return {
            "verified": False,
            "score": 0.0,
            "match_count": 0,
            "total": len(reference_bytes_list),
            "message": "No face detected in the submitted image",
            "engine": "face_recognition",
        }

    live_enc = live_encs[0]
    distances = []
    for ref_bytes in reference_bytes_list:
        ref_rgb = to_rgb_array(ref_bytes)
        ref_encs = face_recognition.face_encodings(ref_rgb)
        if ref_encs:
            dist = float(face_recognition.face_distance([ref_encs[0]], live_enc)[0])
            distances.append(dist)

    if not distances:
        return {
            "verified": False,
            "score": 0.0,
            "match_count": 0,
            "total": len(reference_bytes_list),
            "message": "No faces detected in reference images",
            "engine": "face_recognition",
        }

    threshold = 0.5  # dlib distance threshold (lower = stricter)
    match_count = sum(1 for d in distances if d < threshold)
    total = len(distances)
    proportion = match_count / total
    verified = proportion >= VERIFICATION_THRESHOLD
    avg_dist = float(np.mean(distances))
    # Convert distance to a 0-1 similarity score (inverted & clamped)
    avg_score = round(max(0.0, 1.0 - avg_dist), 4)

    return {
        "verified": verified,
        "score": avg_score,
        "match_count": match_count,
        "total": total,
        "message": "Identity verified" if verified else "Identity not confirmed",
        "engine": "face_recognition",
    }


def verify(input_bytes: bytes, input_arr: np.ndarray) -> dict:
    """
    Public entry point for verification.
    Dispatches to Siamese model or fallback depending on what's available.
    """
    # Load all reference images
    if not os.path.isdir(REFERENCE_DIR):
        return {
            "verified": False,
            "score": 0.0,
            "match_count": 0,
            "total": 0,
            "message": "No reference images found. Please register your face first.",
            "engine": "none",
        }

    ref_files = [
        f for f in os.listdir(REFERENCE_DIR)
        if f.lower().endswith((".jpg", ".jpeg", ".png"))
    ]

    if not ref_files:
        return {
            "verified": False,
            "score": 0.0,
            "match_count": 0,
            "total": 0,
            "message": "No reference images found. Please register your face first.",
            "engine": "none",
        }

    if _use_fallback:
        ref_bytes_list = []
        for fname in ref_files:
            with open(os.path.join(REFERENCE_DIR, fname), "rb") as f:
                ref_bytes_list.append(f.read())
        return _verify_fallback(input_bytes, ref_bytes_list)
    else:
        from app.services.face_ops import preprocess_bytes
        ref_arrs = []
        for fname in ref_files:
            with open(os.path.join(REFERENCE_DIR, fname), "rb") as f:
                ref_arrs.append(preprocess_bytes(f.read()))
        return _verify_siamese(input_arr, ref_arrs)

