from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.attendance import Attendance
from app.models.suspicious_activity import SuspiciousActivity
from app.models.engagement import EngagementLog

def get_dashboard_analytics(db: Session, classroom_id: int = None):
    # Base queries
    att_query = db.query(Attendance)
    susp_query = db.query(SuspiciousActivity)
    eng_query = db.query(func.avg(EngagementLog.engagement_score))
    
    if classroom_id:
        att_query = att_query.filter(Attendance.classroom_id == classroom_id)
        susp_query = susp_query.filter(SuspiciousActivity.classroom_id == classroom_id)
        eng_query = eng_query.filter(EngagementLog.classroom_id == classroom_id)
        
    total_records = att_query.count()
    if total_records == 0:
        return {
            "attendance_percentage": 0,
            "active_students": 0,
            "suspicious_students": 0,
            "engagement_average": 0
        }

    present_count = att_query.filter(Attendance.status == 'Present').count()
    attendance_percentage = (present_count / total_records) * 100
    
    suspicious_count = susp_query.count()
    
    engagement_avg = eng_query.scalar() or 0
    
    return {
        "attendance_percentage": round(attendance_percentage, 2),
        "active_students": present_count,
        "suspicious_students": suspicious_count,
        "engagement_average": round(engagement_avg, 2)
    }
