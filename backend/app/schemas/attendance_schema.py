from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AttendanceInput(BaseModel):
    classroom_id: int
    face_detected: bool
    engagement_score: float
    inactive_time: int
    multiple_faces: bool
    liveness_score: float

class AttendanceResponse(BaseModel):
    id: int
    user_id: int
    classroom_id: int
    status: str
    confidence_score: float
    engagement_score: float
    join_time: datetime
    leave_time: Optional[datetime] = None

    class Config:
        from_attributes = True

class EngagementLogCreate(BaseModel):
    classroom_id: int
    eye_tracking: bool
    head_pose: str
    is_active: bool
    tab_switching_detected: bool
    engagement_score: int
