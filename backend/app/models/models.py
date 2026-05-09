from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Float, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.database import Base

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

class Classroom(Base):
    __tablename__ = "classrooms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    teacher_id = Column(Integer, ForeignKey("users.id"))
    invite_code = Column(String, unique=True)
    is_live = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    attendance_records = relationship("Attendance", back_populates="classroom")

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

class FaceEmbedding(Base):
    __tablename__ = "face_embeddings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    embedding = Column(JSON)  # Store vector as JSON or use pgvector
    angle = Column(String)  # front, left, right
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="face_embeddings")

class EngagementLog(Base):
    __tablename__ = "engagement_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    classroom_id = Column(Integer, ForeignKey("classrooms.id"))
    eye_tracking = Column(Boolean)
    head_pose = Column(String)
    is_active = Column(Boolean)
    tab_switching_detected = Column(Boolean, default=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="engagement_logs")

class SuspiciousActivity(Base):
    __tablename__ = "suspicious_activities"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    classroom_id = Column(Integer, ForeignKey("classrooms.id"))
    activity_type = Column(String)  # Multiple faces, No face, Phone detected, etc.
    description = Column(String)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
