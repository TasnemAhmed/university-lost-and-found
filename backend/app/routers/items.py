from datetime import date
from typing import Optional, List
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Header,
    Query,
    UploadFile,
    File,
    Form,
    status
)
from pydantic import EmailStr
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.models.item import ItemType, ItemStatus
from app.schemas.item import (
    ItemCreate,
    ItemResponse,
    ItemStatusUpdate,
    PaginatedItemsResponse,
    StatsResponse
)
from app.services.item_service import ItemService
from app.services.storage_service import storage_service

router = APIRouter(prefix="/items", tags=["items"])


@router.get("", response_model=PaginatedItemsResponse)
def get_items(
    type: Optional[ItemType] = Query(None, description="Filter by LOST or FOUND"),
    category: Optional[str] = Query(None, description="Filter by category"),
    location: Optional[str] = Query(None, description="Filter by location"),
    search: Optional[str] = Query(None, description="Search in title and description"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(12, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db)
):
    """Retrieve paginated items with combinable search and filters."""
    return ItemService.get_items(
        db=db,
        item_type=type,
        category=category,
        location=location,
        search=search,
        page=page,
        limit=limit
    )


@router.get("/latest", response_model=List[ItemResponse])
def get_latest_items(
    limit: int = Query(6, ge=1, le=20, description="Number of latest items to return"),
    db: Session = Depends(get_db)
):
    """Retrieve the latest reports ordered by creation date."""
    return ItemService.get_latest_items(db=db, limit=limit)


@router.get("/stats", response_model=StatsResponse)
def get_stats(db: Session = Depends(get_db)):
    """Retrieve real-time platform statistics from database."""
    return ItemService.get_stats(db=db)


@router.get("/{item_id}", response_model=ItemResponse)
def get_item_by_id(item_id: int, db: Session = Depends(get_db)):
    """Retrieve complete information for a specific item by ID."""
    item = ItemService.get_item_by_id(db=db, item_id=item_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item with id {item_id} not found."
        )
    return item


@router.post("", response_model=ItemResponse, status_code=status.HTTP_201_CREATED)
async def create_item(
    title: str = Form(...),
    description: str = Form(...),
    type: ItemType = Form(...),
    category: str = Form(...),
    location: str = Form(...),
    item_date: date = Form(...),
    contact_name: str = Form(...),
    contact_email: EmailStr = Form(...),
    contact_phone: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    """
    Accepts new item report with optional image upload via multipart/form-data.
    Validates all inputs, saves image to storage, and persists item record.
    """
    # 1. Validate payload using Pydantic ItemCreate schema
    try:
        item_data = ItemCreate(
            title=title,
            description=description,
            type=type,
            category=category,
            location=location,
            item_date=item_date,
            contact_name=contact_name,
            contact_email=contact_email,
            contact_phone=contact_phone if contact_phone and contact_phone.strip() else None
        )
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(ve)
        )

    # 2. Process image upload if provided
    image_url: Optional[str] = None
    image_key: Optional[str] = None
    if image and image.filename and image.filename.strip():
        image_url, image_key = await storage_service.save_image(image)

    # 3. Create database record
    new_item = ItemService.create_item(
        db=db,
        item_in=item_data,
        image_url=image_url,
        image_key=image_key
    )
    return new_item


@router.patch("/{item_id}/status", response_model=ItemResponse)
def update_item_status(
    item_id: int,
    status_update: ItemStatusUpdate,
    x_admin_api_key: Optional[str] = Header(None, alias="x-admin-api-key"),
    db: Session = Depends(get_db)
):
    """
    Update item status between OPEN and RETURNED.
    Protected by server-side ADMIN_API_KEY header to prevent unrestricted public modification.
    """
    if not x_admin_api_key or x_admin_api_key != settings.ADMIN_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Invalid or missing administrative API key."
        )

    updated_item = ItemService.update_item_status(
        db=db,
        item_id=item_id,
        status=status_update.status
    )
    if not updated_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item with id {item_id} not found."
        )
    return updated_item
