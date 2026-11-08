# Face-X — Facial Verification App

Real-time facial verification using a Siamese Neural Network. No retraining needed to register new users.

---

## Quick Start

### Backend
```bash
cd backend
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API docs available at: http://localhost:8000/docs

### Frontend
```bash
cd frontend
npm install
npm run dev
```

App runs at: http://localhost:5173

---

## Add Your Trained Model

After training (see `FaceRecognition/` notebooks), copy the model file here:
```
backend/data/models/siamesemodelv2.h5
```

Without the model file the app automatically uses the `face_recognition` fallback.

---

## Usage Flow

1. Open **Register** → capture 5+ photos of your face → Save
2. Open **Train** (`🧠 Train`) → click "🚀 Start Training" to train your Siamese model in 1 click with real-time epoch, loss, and accuracy streaming (one-time setup)
3. Open **Verify** → click "Verify Me" → get instant facial verification results with confidence scores

See [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for the full architecture.

