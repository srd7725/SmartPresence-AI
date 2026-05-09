from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User
from app.schemas.attendance_schema import EngagementLogCreate
from app.core.dependencies import get_current_user
from app.services.monitoring_service import log_engagement

router = APIRouter()

@router.post("/log-activity")
def create_engagement_log(
    log_data: EngagementLogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    log_engagement(db, current_user.id, log_data)
    return {"message": "Activity logged"}
