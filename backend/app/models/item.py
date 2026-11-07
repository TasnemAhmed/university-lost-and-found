import enum
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Date,
    DateTime,
    Enum as SQLEnum,
    Index
)
from app.core.database import Base


class ItemType(str, enum.Enum):
    LOST = "LOST"
    FOUND = "FOUND"


class ItemStatus(str, enum.Enum):
    OPEN = "OPEN"
    RETURNED = "RETURNED"


class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    type = Column(SQLEnum(ItemType, name="item_type_enum"), nullable=False, index=True)
    category = Column(String(50), nullable=False, index=True)
    location = Column(String(150), nullable=False, index=True)
    item_date = Column(Date, nullable=False)
    image_url = Column(Text, nullable=True)
    image_key = Column(String(500), nullable=True)
    contact_name = Column(String(100), nullable=False)
    contact_email = Column(String(255), nullable=False)
    contact_phone = Column(String(30), nullable=True)
    status = Column(
        SQLEnum(ItemStatus, name="item_status_enum"),
        nullable=False,
        default=ItemStatus.OPEN,
        server_default="OPEN"
    )
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        index=True
    )

    __table_args__ = (
        Index("idx_items_type", "type"),
        Index("idx_items_category", "category"),
        Index("idx_items_location", "location"),
        Index("idx_items_created_at", "created_at"),
    )
