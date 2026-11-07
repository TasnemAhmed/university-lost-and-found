from datetime import date, datetime
from typing import Optional, List
import email_validator
from pydantic import BaseModel, Field, EmailStr, field_validator, ConfigDict
from app.models.item import ItemType, ItemStatus

# Disable DNS MX lookup for fast and offline-capable email validation
email_validator.CHECK_DELIVERABILITY = False


class ItemBase(BaseModel):
    title: str = Field(..., min_length=2, max_length=150)
    description: str = Field(..., min_length=5)
    type: ItemType
    category: str = Field(..., min_length=2, max_length=50)
    location: str = Field(..., min_length=2, max_length=150)
    item_date: date
    contact_name: str = Field(..., min_length=2, max_length=100)
    contact_email: EmailStr
    contact_phone: Optional[str] = Field(None, max_length=30)

    @field_validator("item_date")
    @classmethod
    def validate_not_future_date(cls, v: date) -> date:
        if v > date.today():
            raise ValueError("Item date cannot be in the future")
        return v

    @field_validator("title", "description", "location", "contact_name")
    @classmethod
    def strip_and_check_non_empty(cls, v: str) -> str:
        s = v.strip()
        if not s:
            raise ValueError("Field cannot be empty or only whitespace")
        return s


class ItemCreate(ItemBase):
    pass


class ItemStatusUpdate(BaseModel):
    status: ItemStatus


class ItemResponse(ItemBase):
    id: int
    image_url: Optional[str] = None
    image_key: Optional[str] = None
    status: ItemStatus
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PaginatedItemsResponse(BaseModel):
    items: List[ItemResponse]
    total: int
    page: int
    limit: int
    total_pages: int


class StatsResponse(BaseModel):
    total_reports: int
    lost_items: int
    found_items: int
    returned_items: int
