import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.core.database import Base, engine
from app.routers import items

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Only auto-create tables on startup when using SQLite / local testing
    if settings.is_sqlite:
        try:
            Base.metadata.create_all(bind=engine)
        except Exception as e:
            logger.warning("SQLite create_all warning: %s", e)

    # Ensure upload directory exists
    try:
        settings.upload_path.mkdir(parents=True, exist_ok=True)
    except Exception as e:
        logger.warning("Upload dir warning: %s", e)
    yield


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="REST API for the University Lost & Found platform at AASTMT.",
    lifespan=lifespan
)

# Configure CORS
origins = [
    settings.FRONTEND_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if settings.APP_ENV == "production" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve local uploads
app.mount(
    "/uploads",
    StaticFiles(directory=str(settings.upload_path)),
    name="uploads"
)


@app.get("/api/health", tags=["health"])
def health_check():
    """Health check endpoint for container / ALB / monitoring."""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "environment": settings.APP_ENV,
        "storage_mode": settings.STORAGE_MODE
    }


# Include routers with /api prefix
app.include_router(items.router, prefix="/api")


@app.get("/", tags=["root"])
def root():
    return {
        "message": f"Welcome to {settings.APP_NAME} API",
        "documentation": "/docs",
        "health": "/api/health"
    }
