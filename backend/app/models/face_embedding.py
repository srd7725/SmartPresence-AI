from sqlalchemy import Column, Integer, JSON, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base

class FaceEmbedding(Base):
    __tablename__ = "face_embeddings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    embedding = Column(JSON)  # Store vector as JSON
    angle = Column(String)  # front, left, right
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="face_embeddings")
