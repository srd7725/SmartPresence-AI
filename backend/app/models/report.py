from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    classroom_id = Column(Integer, ForeignKey("classrooms.id"))
    generated_by = Column(Integer, ForeignKey("users.id"))
    report_type = Column(String) # attendance, engagement, suspicious
    data = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    classroom = relationship("Classroom")
    creator = relationship("User")
