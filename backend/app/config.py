import os

# ── Paths ──────────────────────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
MODEL_PATH = os.path.join(DATA_DIR, "models", "siamesemodelv2.h5")
REFERENCE_DIR = os.path.join(DATA_DIR, "reference_faces")

# ── Training data ─────────────────────────────────────────────────────────────
# Parent of the backend/ directory → project root
PROJECT_ROOT = os.path.dirname(BASE_DIR)
LFW_DIR = os.path.join(
    PROJECT_ROOT,
    "FaceRecognition",
    "archive",
    "lfw-deepfunneled",
    "lfw-deepfunneled",
)

# Ensure required directories exist
os.makedirs(os.path.join(DATA_DIR, "models"), exist_ok=True)
os.makedirs(REFERENCE_DIR, exist_ok=True)
os.makedirs(LFW_DIR, exist_ok=True)

# ── Verification thresholds ───────────────────────────────────────────────────
# Minimum similarity score (0-1) for a single image pair to count as a match
DETECTION_THRESHOLD = 0.5
# Minimum fraction of reference images that must match to verify identity
VERIFICATION_THRESHOLD = 0.5

# ── CORS ──────────────────────────────────────────────────────────────────────
CORS_ORIGINS = [
    "http://localhost:5173",   # Vite dev server
    "http://localhost:4173",   # Vite preview
    "http://127.0.0.1:5173",
]

