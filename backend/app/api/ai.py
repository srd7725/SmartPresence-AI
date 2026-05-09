from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User
from app.models.face_embedding import FaceEmbedding
from app.core.dependencies import get_current_user
from app.services.ai_service import verify_face, analyze_frame

router = APIRouter()

@router.post("/face-enroll")
async def enroll_face(
    angle: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    contents = await file.read()
    # In a real app, you would send contents to the ML service to get an embedding.
    # For now, we mock saving a face enrollment.
    embedding = FaceEmbedding(
        user_id=current_user.id,
        embedding={"mock": "data", "angle": angle},
        angle=angle
    )
    db.add(embedding)
    db.commit()
    return {"message": "Face enrolled successfully"}

@router.post("/verify-face")
async def verify_user_face(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    contents = await file.read()
    result = await verify_face(contents, current_user.enrollment_number)
    if not result:
        raise HTTPException(status_code=400, detail="Failed to verify face with AI service")
    return result

@router.post("/analyze-frame")
async def analyze_video_frame(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    contents = await file.read()
    result = await analyze_frame(contents)
    if not result:
         raise HTTPException(status_code=400, detail="Failed to analyze frame")
    return result
