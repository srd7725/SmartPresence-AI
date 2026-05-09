from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User
from app.schemas.analytics_schema import DashboardStats
from app.core.dependencies import get_current_teacher
from app.services.analytics_service import get_dashboard_analytics

router = APIRouter()

@router.get("/dashboard", response_model=DashboardStats)
def get_dashboard_data(classroom_id: int = None, db: Session = Depends(get_db), current_teacher: User = Depends(get_current_teacher)):
    return get_dashboard_analytics(db, classroom_id)
