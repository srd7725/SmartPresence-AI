from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

# API Routers
from app.api import auth, users, classroom, attendance, analytics, reports, monitoring, ai
from app.websocket import live_monitor

# Database
from app.database.connection import engine
from app.database.base import Base

def create_app() -> FastAPI:
    # Initialize FastAPI
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description="Intelligent Attendance & Student Engagement Monitoring Platform API"
    )

    # Setup CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Import models so they are registered with SQLAlchemy
    from app.models.user import User
    from app.models.classroom import Classroom
    from app.models.attendance import Attendance
    from app.models.engagement import EngagementLog
    from app.models.suspicious_activity import SuspiciousActivity
    from app.models.report import Report
    from app.models.face_embedding import FaceEmbedding

    # Initialize Database Tables
    # In a production setting, use Alembic for migrations instead.
    try:
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully.")
    except Exception as e:
        print(f"Warning: Could not connect to the database or create tables. {e}")

    # Include REST API Routers
    app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
    app.include_router(users.router, prefix=f"{settings.API_V1_STR}/users", tags=["users"])
    app.include_router(classroom.router, prefix=f"{settings.API_V1_STR}/classroom", tags=["classroom"])
    app.include_router(attendance.router, prefix=f"{settings.API_V1_STR}/attendance", tags=["attendance"])
    app.include_router(analytics.router, prefix=f"{settings.API_V1_STR}/analytics", tags=["analytics"])
    app.include_router(reports.router, prefix=f"{settings.API_V1_STR}/reports", tags=["reports"])
    app.include_router(monitoring.router, prefix=f"{settings.API_V1_STR}/monitoring", tags=["monitoring"])
    app.include_router(ai.router, prefix=f"{settings.API_V1_STR}/ai", tags=["ai"])

    # Include WebSocket Router
    app.include_router(live_monitor.router, prefix="/ws", tags=["websocket"])

    @app.get("/")
    def root():
        return {"message": f"Welcome to {settings.PROJECT_NAME} Backend."}

    @app.get("/health", tags=["health"])
    def health_check():
        return {"status": "healthy", "version": settings.VERSION}

    return app

# Instantiate the application
app = create_app()
