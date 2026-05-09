from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base

class Classroom(Base):
    __tablename__ = "classrooms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    teacher_id = Column(Integer, ForeignKey("users.id"))
    invite_code = Column(String, unique=True)
    is_live = Column(Boolean, default=False)
    schedule = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    teacher = relationship("User", back_populates="classrooms_taught")
    attendance_records = relationship("Attendance", back_populates="classroom")
