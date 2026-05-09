from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User
from app.models.report import Report
from app.core.dependencies import get_current_teacher

router = APIRouter()

@router.get("/")
def get_reports(db: Session = Depends(get_db), current_teacher: User = Depends(get_current_teacher)):
    return db.query(Report).filter(Report.generated_by == current_teacher.id).all()

@router.post("/generate/{classroom_id}")
def generate_report(classroom_id: int, report_type: str, db: Session = Depends(get_db), current_teacher: User = Depends(get_current_teacher)):
    # Mock generating report logic
    report_data = {"summary": "Generated mock report data for classroom.", "type": report_type}
    
    report = Report(
        classroom_id=classroom_id,
        generated_by=current_teacher.id,
        report_type=report_type,
        data=report_data
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report
