# Face-X Facial Verification App

Real-time facial verification with a Siamese Neural Network (FastAPI + React).

The app supports two verification modes:
1. Siamese mode when a trained model exists at `backend/data/models/siamesemodelv2.h5`
2. Fallback mode using `face_recognition` when no trained model exists

## What Is Ignored by Git

This repository intentionally does not track large/private assets.

Ignored paths include:
1. `FaceRecognition/` (dataset notebooks and LFW archive)
2. `backend/data/reference_faces/` (your captured face images)
3. `backend/data/models/` and `backend/data/models/siamesemodelv2.h5` (trained model)
4. `backend/.venv` and root/other virtual environments
5. Frontend build artifacts (`frontend/node_modules/`, `frontend/dist/`)

If you already tracked any of these by mistake, remove them from Git index once:

```bash
git rm -r --cached FaceRecognition backend/data/reference_faces backend/data/models
git commit -m "Stop tracking local data and model artifacts"
```

## Prerequisites

1. macOS (project currently configured with `tensorflow-macos` in backend requirements)
2. Python 3.11 recommended
3. Node.js 18+ and npm

Check versions:

```bash
python3 --version
node --version
npm --version
```

## 1) Clone and Install

### Backend

```bash
cd backend
python3.11 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

### Frontend

Open a second terminal:

```bash
cd frontend
npm install
```

## 2) Download the Dataset (LFW)

Training expects the LFW images here (exact nested path):

```text
FaceRecognition/archive/lfw-deepfunneled/lfw-deepfunneled/
```

Each person folder should be inside the final `lfw-deepfunneled` directory.

Expected example:

```text
Face_X_Project/
	FaceRecognition/
		archive/
			lfw-deepfunneled/
				lfw-deepfunneled/
					Aaron_Eckhart/
					Aaron_Peirsol/
					...
```

If you are downloading from the official LFW source or Kaggle, unpack the archive and move folders until the structure matches above.

Why this matters: backend config resolves dataset path from `backend/app/config.py` using `LFW_DIR`, and training fails if the folder does not exist.

## 3) Run the Backend API

From `backend/` with virtual environment activated:

```bash
uvicorn app.main:app --reload --port 8000
```

Health check:

```bash
curl http://localhost:8000/health
```

API docs:

```text
http://localhost:8000/docs
```

## 4) Run the Frontend

From `frontend/`:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

## 5) Register Face Images

In the app, open Register page and capture several clear photos.

Saved files go to:

```text
backend/data/reference_faces/
```

Tips:
1. Capture at least 3 images (5+ recommended)
2. Use good lighting and slightly different angles

## 6) Train the Siamese Model

Open Train page and start training.

Or call API directly:

```bash
curl -X POST "http://localhost:8000/api/train/start?epochs=15&batch_size=16"
```

Check status:

```bash
curl http://localhost:8000/api/train/status
```

Training output model is saved to:

```text
backend/data/models/siamesemodelv2.h5
```

After saving, backend hot-reloads the model automatically.

## 7) Verify Identity

Open Verify page and capture/upload face image.

API endpoint:

```text
POST /api/verify
```

Response includes:
1. `verified` (true/false)
2. `score` (confidence-like value)
3. `match_count` and `total`
4. `engine` (`siamese`, `face_recognition`, or `none`)

## Backend API Summary

1. `GET /health`
2. `POST /api/register/capture`
3. `GET /api/register/status`
4. `DELETE /api/register/reset`
5. `POST /api/train/start`
6. `GET /api/train/status`
7. `GET /api/train/stream` (SSE)
8. `POST /api/verify`

## Common Issues

1. `LFW dataset not found`
Fix the dataset path to match:
`FaceRecognition/archive/lfw-deepfunneled/lfw-deepfunneled/`

2. Model not found warning
Normal before first training. Verification falls back to `face_recognition`.

3. CORS or frontend cannot reach backend
Ensure backend is running on port `8000` and frontend on `5173`.

## Project Notes

Architecture and implementation details are documented in `IMPLEMENTATION_PLAN.md`.

