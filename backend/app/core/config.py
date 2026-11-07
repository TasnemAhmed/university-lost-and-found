import os
from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_ENV: str = "development"
    APP_NAME: str = "University Lost & Found"
    DATABASE_URL: str = "postgresql+psycopg://postgres:password@localhost:5432/lost_found_db"
    FRONTEND_URL: str = "http://localhost:5173"
    STORAGE_MODE: str = "local"  # "local" or "s3"
    UPLOAD_DIR: str = "uploads"
    AWS_REGION: str = "us-east-1"
    S3_BUCKET_NAME: str = ""
    ADMIN_API_KEY: str = "supersecretadminapikey123"

    MAX_IMAGE_SIZE_BYTES: int = 5 * 1024 * 1024  # 5 MB
    ALLOWED_IMAGE_TYPES: List[str] = ["image/jpeg", "image/png", "image/webp"]
    ALLOWED_IMAGE_EXTENSIONS: List[str] = [".jpg", ".jpeg", ".png", ".webp"]

    model_config = SettingsConfigDict(
        env_file=str(Path(__file__).resolve().parent.parent.parent / ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def is_sqlite(self) -> bool:
        return self.DATABASE_URL.startswith("sqlite")

    @property
    def upload_path(self) -> Path:
        base = Path(__file__).resolve().parent.parent.parent
        p = base / self.UPLOAD_DIR
        p.mkdir(parents=True, exist_ok=True)
        return p


settings = Settings()
