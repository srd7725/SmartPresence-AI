from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    classroom_id = Column(Integer, ForeignKey("classrooms.id"))
    status = Column(String)  # Present, Partial, Absent, Suspicious
    confidence_score = Column(Float)
    engagement_score = Column(Float)
    join_time = Column(DateTime(timezone=True), server_default=func.now())
    leave_time = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="attendance_records")
    classroom = relationship("Classroom", back_populates="attendance_records")
