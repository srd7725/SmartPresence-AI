from sqlalchemy import Column, Integer, Boolean, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base

class EngagementLog(Base):
    __tablename__ = "engagement_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    classroom_id = Column(Integer, ForeignKey("classrooms.id"))
    eye_tracking = Column(Boolean)
    head_pose = Column(String)
    is_active = Column(Boolean)
    tab_switching_detected = Column(Boolean, default=False)
    engagement_score = Column(Integer, default=0)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="engagement_logs")
