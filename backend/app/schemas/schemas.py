from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    full_name: str
    email: EmailStr
    role: str
    enrollment_number: Optional[str] = None
    department: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

class ClassroomBase(BaseModel):
    name: str
    description: Optional[str] = None

class ClassroomCreate(ClassroomBase):
    pass

class ClassroomResponse(ClassroomBase):
    id: int
    teacher_id: int
    invite_code: str
    is_live: bool
    created_at: datetime

    class Config:
        orm_mode = True

class AttendanceBase(BaseModel):
    classroom_id: int
    status: str
    confidence_score: float
    engagement_score: float

class AttendanceResponse(AttendanceBase):
    id: int
    user_id: int
    join_time: datetime
    leave_time: Optional[datetime] = None

    class Config:
        orm_mode = True
