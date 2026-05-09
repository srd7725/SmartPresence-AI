from sqlalchemy.orm import Session
from app.models.attendance import Attendance
from app.models.suspicious_activity import SuspiciousActivity
from app.schemas.attendance_schema import AttendanceInput

def process_attendance(db: Session, user_id: int, input_data: AttendanceInput):
    # Decision Engine Logic
    status = "Absent"
    suspicious = False
    suspicious_reason = ""

    if not input_data.face_detected:
        status = "Absent"
    elif input_data.multiple_faces:
        status = "Suspicious"
        suspicious = True
        suspicious_reason = "Multiple faces detected"
    elif input_data.inactive_time > 300: # 5 minutes
        status = "Suspicious"
        suspicious = True
        suspicious_reason = "Long inactivity period"
    elif input_data.engagement_score >= 70 and input_data.liveness_score >= 80:
        status = "Present"
    elif input_data.engagement_score >= 40:
        status = "Partial Present"
    else:
        status = "Suspicious"
        suspicious = True
        suspicious_reason = "Low engagement or liveness"

    # Save Attendance
    attendance = Attendance(
        user_id=user_id,
        classroom_id=input_data.classroom_id,
        status=status,
        confidence_score=input_data.liveness_score,
        engagement_score=input_data.engagement_score
    )
    db.add(attendance)
    
    if suspicious:
        activity = SuspiciousActivity(
            user_id=user_id,
            classroom_id=input_data.classroom_id,
            activity_type=status,
            description=suspicious_reason
        )
        db.add(activity)

    db.commit()
    db.refresh(attendance)
    return attendance
