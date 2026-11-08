"""
main.py — FastAPI application entry point.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import CORS_ORIGINS
from app.routes import register, train, verify
from app.services import model as model_service


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load the model once when the server starts."""
    model_service.load_model()
    yield


app = FastAPI(
    title="Face-X API",
    description="Facial verification API powered by a Siamese Network",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(register.router)
app.include_router(train.router)
app.include_router(verify.router)


# ── Health check ──────────────────────────────────────────────────────────────
@app.get("/health")
async def health():
    return {"status": "ok", "message": "Face-X API is running"}

