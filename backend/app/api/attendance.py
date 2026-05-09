from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.models.attendance import Attendance
from app.models.user import User
from app.schemas.attendance_schema import AttendanceInput, AttendanceResponse
from app.core.dependencies import get_current_user, get_current_teacher
from app.services.attendance_service import process_attendance
from app.services.websocket_manager import ws_manager

router = APIRouter()

@router.post("/mark-attendance", response_model=AttendanceResponse)
async def mark_attendance(data: AttendanceInput, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    attendance = process_attendance(db, current_user.id, data)
    
    # Notify teacher dashboard via websocket
    await ws_manager.broadcast_json_to_classroom(
        {
            "event": "attendance_update",
            "user_id": current_user.id,
            "status": attendance.status,
            "engagement": attendance.engagement_score
        }, 
        data.classroom_id
    )
    
    return attendance

@router.get("/student-attendance", response_model=List[AttendanceResponse])
def get_student_attendance(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Attendance).filter(Attendance.user_id == current_user.id).all()

@router.get("/class-attendance/{class_id}", response_model=List[AttendanceResponse])
def get_class_attendance(class_id: int, db: Session = Depends(get_db), current_teacher: User = Depends(get_current_teacher)):
    return db.query(Attendance).filter(Attendance.classroom_id == class_id).all()
