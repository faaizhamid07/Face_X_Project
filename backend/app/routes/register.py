"""
register.py — API routes for face registration.

Endpoints:
  POST   /api/register/capture  — Upload a reference face image
  GET    /api/register/status   — Get count of registered images
  DELETE /api/register/reset    — Clear all registered images
"""

import os
import uuid
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from app.config import REFERENCE_DIR

router = APIRouter(prefix="/api/register", tags=["register"])

ALLOWED_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/webp"}


@router.post("/capture")
async def capture_reference(file: UploadFile = File(...)):
    """Save an uploaded face image as a reference image."""
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=422,
            detail=f"Unsupported file type: {file.content_type}. Use JPEG or PNG.",
        )

    os.makedirs(REFERENCE_DIR, exist_ok=True)
    ext = "jpg" if "jpeg" in (file.content_type or "") or "jpg" in (file.content_type or "") else "png"
    filename = f"{uuid.uuid4()}.{ext}"
    filepath = os.path.join(REFERENCE_DIR, filename)

    contents = await file.read()
    with open(filepath, "wb") as f:
        f.write(contents)

    total = len([
        x for x in os.listdir(REFERENCE_DIR)
        if x.lower().endswith((".jpg", ".jpeg", ".png"))
    ])

    return JSONResponse({
        "success": True,
        "filename": filename,
        "total_registered": total,
        "message": f"Reference image saved. Total: {total}",
    })


@router.get("/status")
async def registration_status():
    """Return the number of registered reference images."""
    if not os.path.isdir(REFERENCE_DIR):
        return {"registered": 0, "ready": False}

    count = len([
        f for f in os.listdir(REFERENCE_DIR)
        if f.lower().endswith((".jpg", ".jpeg", ".png"))
    ])
    return {
        "registered": count,
        "ready": count >= 3,
        "message": (
            f"{count} reference image(s) registered."
            if count > 0
            else "No images registered yet."
        ),
    }


@router.delete("/reset")
async def reset_registration():
    """Delete all registered reference images."""
    if os.path.isdir(REFERENCE_DIR):
        shutil.rmtree(REFERENCE_DIR)
    os.makedirs(REFERENCE_DIR, exist_ok=True)
    return {"success": True, "message": "All reference images cleared."}

