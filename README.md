# Face-X Facial Verification App

Real-time facial verification with a Siamese Neural Network (FastAPI + React).

The app supports two verification modes:
1. Siamese mode when a trained model exists at `backend/data/models/siamesemodelv2.h5`
2. Optional fallback mode using `face_recognition` when no trained model exists (install separately; see below)

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

1. Windows 10/11, macOS, or Linux (64-bit)
2. Python 3.11 (64-bit) recommended
3. Node.js 18+ and npm

Check versions:

```bash
python --version
node --version
npm --version
```

On macOS or Linux you may use `python3` instead of `python`. TensorFlow on native Windows uses CPU with the versions pinned by this project; native Windows GPU support for current TensorFlow is not provided. For GPU training on Windows consider WSL2. On Apple Silicon, `tensorflow-metal` is optional and not installed by default.

## 1) Clone and Install

### Backend (Windows PowerShell)

From the repository root:

```powershell
cd backend
py -3.11 -m venv .venv
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

Using the virtual environment's Python directly avoids PowerShell execution-policy issues. To activate it instead, run `.\.venv\Scripts\Activate.ps1` if your execution policy permits it.

### Backend (macOS / Linux)

```bash
cd backend
python3.11 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

On Apple Silicon, you can optionally install `tensorflow-metal` separately if supported by your installed TensorFlow version. This application currently disables GPU devices for training and inference, so installing the plugin alone does not enable acceleration.

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

From `backend/`, run:

**Windows PowerShell:**

```powershell
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
```

**macOS / Linux (activated virtual environment):**

```bash
python -m uvicorn app.main:app --reload --port 8000
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

## Optional fallback verification

The `face_recognition` package is **not** part of the default requirements. Without a trained Siamese model, verification will report that the fallback dependency is missing. If you want fallback verification before training, install `face_recognition` separately. It depends on `dlib`, which can require a C++ build toolchain and CMake on Windows; installation is not guaranteed. Alternatively, use the built-in training flow and LFW dataset to create the Siamese model.

## Common Issues

1. `LFW dataset not found`
Fix the dataset path to match:
`FaceRecognition/archive/lfw-deepfunneled/lfw-deepfunneled/`

2. Model not found warning
Normal before first training. Verification can fall back to `face_recognition` only if you install that optional library. Otherwise, register images and train the Siamese model first.

3. CORS or frontend cannot reach backend
Ensure backend is running on port `8000` and frontend on `5173`.

4. Windows: `py -3.11` is not recognized
Install 64-bit Python 3.11 and enable the Python launcher, or replace `py -3.11` with the path to your Python 3.11 executable.

5. TensorFlow installation fails
Use Python 3.11 64-bit. On Windows, install the Microsoft Visual C++ Redistributable if TensorFlow reports missing runtime DLLs. For Windows GPU acceleration use WSL2 rather than native Windows.

6. Browser camera unavailable
Allow webcam access in the browser. Use `localhost` for development (or HTTPS for remote deployment).

## Project Notes

Architecture and implementation details are documented in `IMPLEMENTATION_PLAN.md`.

