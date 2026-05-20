from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
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

    # Global Exception Handlers
    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request, exc: StarletteHTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "message": exc.detail
            }
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request, exc: RequestValidationError):
        # Format validation errors beautifully
        errors = exc.errors()
        error_messages = []
        for err in errors:
            loc = " -> ".join(str(x) for x in err["loc"] if x != "body")
            msg = err["msg"]
            error_messages.append(f"{loc}: {msg}" if loc else msg)
        
        detail_msg = "; ".join(error_messages)
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "success": False,
                "message": f"Validation Error: {detail_msg}"
            }
        )

    @app.exception_handler(Exception)
    async def generic_exception_handler(request, exc: Exception):
        # Gracefully handle internal errors
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "message": f"Internal Server Error: {str(exc)}"
            }
        )

    # Import models so they are registered with SQLAlchemy Base metadata
    from app.models.user import User
    from app.models.classroom import Classroom
    from app.models.attendance import Attendance
    from app.models.engagement import EngagementLog
    from app.models.suspicious_activity import SuspiciousActivity
    from app.models.report import Report
    from app.models.face_embedding import FaceEmbedding

    # Initialize Database Tables
    try:
        Base.metadata.create_all(bind=engine)
        print("Database tables initialized/checked successfully.")
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
        return {
            "success": True,
            "message": f"Welcome to {settings.PROJECT_NAME} Backend API.",
            "data": {
                "project": settings.PROJECT_NAME,
                "version": settings.VERSION,
                "api_base": settings.API_V1_STR
            }
        }

    @app.get("/health", tags=["health"])
    def health_check():
        return {
            "success": True,
            "message": "Service is running healthy.",
            "data": {
                "status": "healthy",
                "version": settings.VERSION
            }
        }

    return app

# Instantiate the application
app = create_app()
