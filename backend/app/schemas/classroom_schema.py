from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ClassroomBase(BaseModel):
    name: str
    description: Optional[str] = None
    schedule: Optional[datetime] = None

class ClassroomCreate(ClassroomBase):
    pass

class ClassroomResponse(ClassroomBase):
    id: int
    teacher_id: int
    invite_code: str
    is_live: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ClassroomJoin(BaseModel):
    invite_code: str
