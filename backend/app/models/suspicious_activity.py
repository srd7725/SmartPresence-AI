from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base

class SuspiciousActivity(Base):
    __tablename__ = "suspicious_activities"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    classroom_id = Column(Integer, ForeignKey("classrooms.id"))
    activity_type = Column(String)  # Multiple faces, No face, Tab switched, etc.
    description = Column(String)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")
    classroom = relationship("Classroom")
