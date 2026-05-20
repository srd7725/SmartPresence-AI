from pydantic import BaseModel, EmailStr
from typing import Optional, Generic, TypeVar, Any
from datetime import datetime

T = TypeVar('T')

class UserBase(BaseModel):
    full_name: str
    email: EmailStr
    role: str
    enrollment_number: Optional[str] = None
    department: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Standardized API response wrappers
class StandardResponse(BaseModel, Generic[T]):
    success: bool = True
    message: str
    data: Optional[T] = None

class RegisterResponse(BaseModel):
    success: bool = True
    message: str = "User registered successfully"
    data: UserResponse

class MeResponse(BaseModel):
    success: bool = True
    message: str = "User profile retrieved successfully"
    data: UserResponse
