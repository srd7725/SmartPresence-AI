from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.auth_schema import Token, TokenResponse
from app.schemas.user_schema import UserCreate, RegisterResponse, MeResponse
from app.services.auth_service import authenticate_user, create_user
from app.core.security import create_access_token
from app.core.dependencies import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/register", response_model=RegisterResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    user = create_user(db=db, user=user_in)
    return {
        "success": True,
        "message": "User registered successfully",
        "data": user
    }

@router.post("/login", response_model=TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, email=form_data.username, password=form_data.password)
    access_token = create_access_token(subject=user.id, role=user.role)
    token_data = {"access_token": access_token, "token_type": "bearer"}
    return {
        "success": True,
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "data": token_data
    }

@router.get("/me", response_model=MeResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    return {
        "success": True,
        "message": "User profile retrieved successfully",
        "data": current_user
    }
