from sqlalchemy.orm import Session
from app.models.engagement import EngagementLog
from app.schemas.attendance_schema import EngagementLogCreate

def log_engagement(db: Session, user_id: int, log_data: EngagementLogCreate):
    engagement_log = EngagementLog(
        user_id=user_id,
        classroom_id=log_data.classroom_id,
        eye_tracking=log_data.eye_tracking,
        head_pose=log_data.head_pose,
        is_active=log_data.is_active,
        tab_switching_detected=log_data.tab_switching_detected,
        engagement_score=log_data.engagement_score
    )
    db.add(engagement_log)
    db.commit()
    db.refresh(engagement_log)
    return engagement_log
