from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.models.classroom import Classroom
from app.models.user import User
from app.schemas.classroom_schema import ClassroomCreate, ClassroomResponse, ClassroomJoin
from app.core.dependencies import get_current_teacher, get_current_user
import secrets

router = APIRouter()

@router.post("/create-class", response_model=ClassroomResponse)
def create_class(classroom_in: ClassroomCreate, db: Session = Depends(get_db), current_teacher: User = Depends(get_current_teacher)):
    invite_code = secrets.token_hex(4).upper()
    classroom = Classroom(
        name=classroom_in.name,
        description=classroom_in.description,
        schedule=classroom_in.schedule,
        teacher_id=current_teacher.id,
        invite_code=invite_code
    )
    db.add(classroom)
    db.commit()
    db.refresh(classroom)
    return classroom

@router.get("/classes", response_model=List[ClassroomResponse])
def get_classes(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role == "teacher":
        return db.query(Classroom).filter(Classroom.teacher_id == current_user.id).all()
    else:
        # For simplicity, returning all classes for students (in reality, return joined classes)
        return db.query(Classroom).all()

@router.get("/class/{class_id}", response_model=ClassroomResponse)
def get_class(class_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    classroom = db.query(Classroom).filter(Classroom.id == class_id).first()
    if not classroom:
        raise HTTPException(status_code=404, detail="Classroom not found")
    return classroom

@router.post("/join-class", response_model=ClassroomResponse)
def join_class(join_data: ClassroomJoin, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    classroom = db.query(Classroom).filter(Classroom.invite_code == join_data.invite_code).first()
    if not classroom:
        raise HTTPException(status_code=404, detail="Invalid invite code")
    # In a full implementation, you'd add the student to a classroom_enrollments table here.
    return classroom

@router.delete("/class/{class_id}")
def delete_class(class_id: int, db: Session = Depends(get_db), current_teacher: User = Depends(get_current_teacher)):
    classroom = db.query(Classroom).filter(Classroom.id == class_id, Classroom.teacher_id == current_teacher.id).first()
    if not classroom:
        raise HTTPException(status_code=404, detail="Classroom not found or unauthorized")
    db.delete(classroom)
    db.commit()
    return {"message": "Classroom deleted"}
