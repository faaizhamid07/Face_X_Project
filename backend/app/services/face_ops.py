"""
face_ops.py — Image preprocessing helpers.

Replicates the exact preprocessing pipeline from the Siamese Network notebook:
  raw image → decode → resize 100×100 → scale to [0, 1]
"""

import io
import base64
import numpy as np
from PIL import Image


def preprocess_bytes(image_bytes: bytes) -> np.ndarray:
    """
    Decode raw image bytes, resize to 100×100, and normalise to [0, 1].
    Returns a float32 NumPy array of shape (100, 100, 3).
    """
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((100, 100), Image.LANCZOS)
    arr = np.array(img, dtype=np.float32) / 255.0
    return arr


def preprocess_base64(b64_string: str) -> np.ndarray:
    """
    Decode a base64-encoded image (as sent from the browser webcam),
    then preprocess it.
    """
    # Strip data-URL prefix if present  (e.g. "data:image/jpeg;base64,...")
    if "," in b64_string:
        b64_string = b64_string.split(",", 1)[1]
    image_bytes = base64.b64decode(b64_string)
    return preprocess_bytes(image_bytes)

