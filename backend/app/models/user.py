from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    enrollment_number = Column(String, unique=True, index=True, nullable=True)
    department = Column(String, nullable=True)
    hashed_password = Column(String)
    role = Column(String)  # student, teacher, admin
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    face_embeddings = relationship("FaceEmbedding", back_populates="user")
    attendance_records = relationship("Attendance", back_populates="user")
    engagement_logs = relationship("EngagementLog", back_populates="user")
    classrooms_taught = relationship("Classroom", back_populates="teacher")
