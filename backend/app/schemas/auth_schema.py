from pydantic import BaseModel, EmailStr
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

# Standardized token response with Swagger OAuth2 root compatibility
class TokenResponse(BaseModel):
    success: bool = True
    message: str = "Login successful"
    access_token: str
    token_type: str
    data: Optional[Token] = None
