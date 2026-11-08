"""
verify.py — API route for face verification.

Endpoints:
  POST /api/verify — Upload a face image and verify against references
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from app.services import model as model_service
from app.services.face_ops import preprocess_bytes

router = APIRouter(prefix="/api/verify", tags=["verify"])

ALLOWED_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/webp"}


@router.post("")
async def verify_face(file: UploadFile = File(...)):
    """
    Verify whether the face in the uploaded image matches the registered identity.

    Returns:
        verified (bool): True if identity confirmed
        score (float):   Confidence score 0.0 – 1.0
        match_count (int): Number of reference images that matched
        total (int): Total reference images checked
        message (str): Human-readable result
        engine (str): 'siamese' | 'face_recognition' | 'none'
    """
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=422,
            detail=f"Unsupported file type: {file.content_type}. Use JPEG or PNG.",
        )

    contents = await file.read()

    try:
        input_arr = preprocess_bytes(contents)
    except Exception as exc:
        raise HTTPException(status_code=422, detail=f"Could not decode image: {exc}")

    result = model_service.verify(contents, input_arr)
    return JSONResponse(result)

