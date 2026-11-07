import os
import uuid
from pathlib import Path
from typing import Tuple, Optional
from fastapi import UploadFile, HTTPException, status
import boto3
from botocore.exceptions import BotoCoreError, ClientError

from app.core.config import settings


class StorageService:
    def __init__(self):
        self.mode = settings.STORAGE_MODE.lower()
        self.upload_dir = settings.upload_path

    async def validate_image(self, file: UploadFile) -> None:
        """Validates MIME type, extension, and file size."""
        # 1. Validate content type
        content_type = file.content_type or ""
        if content_type.lower() not in settings.ALLOWED_IMAGE_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid image type '{content_type}'. Allowed types: JPG, JPEG, PNG, WEBP."
            )

        # 2. Validate file extension
        filename = file.filename or ""
        ext = Path(filename).suffix.lower()
        if ext not in settings.ALLOWED_IMAGE_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid file extension '{ext}'. Allowed extensions: {', '.join(settings.ALLOWED_IMAGE_EXTENSIONS)}."
            )

        # 3. Validate file size
        contents = await file.read()
        file_size = len(contents)
        await file.seek(0)  # Reset pointer for saving

        if file_size > settings.MAX_IMAGE_SIZE_BYTES:
            max_mb = settings.MAX_IMAGE_SIZE_BYTES // (1024 * 1024)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Image file exceeds maximum limit of {max_mb} MB."
            )

        if file_size == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded file is empty."
            )

    async def save_image(self, file: UploadFile) -> Tuple[str, str]:
        """
        Saves the uploaded file locally or in S3 depending on STORAGE_MODE.
        Returns: (image_url, image_key)
        """
        await self.validate_image(file)

        ext = Path(file.filename or "image.jpg").suffix.lower()
        if not ext:
            ext = ".jpg"
        unique_name = f"{uuid.uuid4().hex}{ext}"

        if self.mode == "s3" and settings.S3_BUCKET_NAME:
            return await self._save_to_s3(file, unique_name)
        else:
            return await self._save_to_local(file, unique_name)

    async def _save_to_local(self, file: UploadFile, unique_name: str) -> Tuple[str, str]:
        """Saves file to backend uploads directory."""
        destination = self.upload_dir / unique_name
        contents = await file.read()

        with open(destination, "wb") as f:
            f.write(contents)

        # image_key for reference, image_url for direct browser access
        image_key = f"local/{unique_name}"
        image_url = f"/uploads/{unique_name}"
        return image_url, image_key

    async def _save_to_s3(self, file: UploadFile, unique_name: str) -> Tuple[str, str]:
        """Uploads file to Amazon S3."""
        s3_key = f"items/{unique_name}"
        try:
            # Prefer IAM role / default credential chain
            s3_client = boto3.client("s3", region_name=settings.AWS_REGION)
            contents = await file.read()

            s3_client.put_object(
                Bucket=settings.S3_BUCKET_NAME,
                Key=s3_key,
                Body=contents,
                ContentType=file.content_type or "image/jpeg"
            )

            image_url = f"https://{settings.S3_BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com/{s3_key}"
            return image_url, s3_key
        except (BotoCoreError, ClientError) as e:
            # Log error and fallback to local storage if S3 fails
            print(f"[StorageService] S3 upload failed: {e}. Falling back to local storage.")
            await file.seek(0)
            return await self._save_to_local(file, unique_name)


storage_service = StorageService()
