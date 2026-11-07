import math
from typing import Optional, List, Dict, Any
from sqlalchemy import select, func, or_
from sqlalchemy.orm import Session

from app.models.item import Item, ItemType, ItemStatus
from app.schemas.item import ItemCreate


class ItemService:
    @staticmethod
    def get_items(
        db: Session,
        item_type: Optional[ItemType] = None,
        category: Optional[str] = None,
        location: Optional[str] = None,
        search: Optional[str] = None,
        page: int = 1,
        limit: int = 12
    ) -> Dict[str, Any]:
        query = select(Item)
        count_query = select(func.count(Item.id))

        filters = []
        if item_type:
            filters.append(Item.type == item_type)
        if category and category.strip() and category.lower() != "all":
            filters.append(Item.category == category.strip())
        if location and location.strip() and location.lower() != "all":
            filters.append(Item.location.ilike(f"%{location.strip()}%"))
        if search and search.strip():
            s = f"%{search.strip()}%"
            filters.append(
                or_(
                    Item.title.ilike(s),
                    Item.description.ilike(s),
                    Item.category.ilike(s),
                    Item.location.ilike(s)
                )
            )

        if filters:
            query = query.where(*filters)
            count_query = count_query.where(*filters)

        total = db.scalar(count_query) or 0
        total_pages = math.ceil(total / limit) if total > 0 else 0

        # Pagination and ordering
        offset = (page - 1) * limit
        items = db.scalars(
            query.order_by(Item.created_at.desc()).offset(offset).limit(limit)
        ).all()

        return {
            "items": items,
            "total": total,
            "page": page,
            "limit": limit,
            "total_pages": total_pages
        }

    @staticmethod
    def get_item_by_id(db: Session, item_id: int) -> Optional[Item]:
        return db.scalar(select(Item).where(Item.id == item_id))

    @staticmethod
    def get_latest_items(db: Session, limit: int = 6) -> List[Item]:
        return db.scalars(
            select(Item).order_by(Item.created_at.desc()).limit(limit)
        ).all()

    @staticmethod
    def create_item(
        db: Session,
        item_in: ItemCreate,
        image_url: Optional[str] = None,
        image_key: Optional[str] = None
    ) -> Item:
        item = Item(
            title=item_in.title,
            description=item_in.description,
            type=item_in.type,
            category=item_in.category,
            location=item_in.location,
            item_date=item_in.item_date,
            contact_name=item_in.contact_name,
            contact_email=item_in.contact_email,
            contact_phone=item_in.contact_phone,
            image_url=image_url,
            image_key=image_key,
            status=ItemStatus.OPEN
        )
        db.add(item)
        db.commit()
        db.refresh(item)
        return item

    @staticmethod
    def get_stats(db: Session) -> Dict[str, int]:
        total_reports = db.scalar(select(func.count(Item.id))) or 0
        lost_items = db.scalar(
            select(func.count(Item.id)).where(Item.type == ItemType.LOST)
        ) or 0
        found_items = db.scalar(
            select(func.count(Item.id)).where(Item.type == ItemType.FOUND)
        ) or 0
        returned_items = db.scalar(
            select(func.count(Item.id)).where(Item.status == ItemStatus.RETURNED)
        ) or 0

        return {
            "total_reports": total_reports,
            "lost_items": lost_items,
            "found_items": found_items,
            "returned_items": returned_items
        }

    @staticmethod
    def update_item_status(
        db: Session,
        item_id: int,
        status: ItemStatus
    ) -> Optional[Item]:
        item = ItemService.get_item_by_id(db, item_id)
        if not item:
            return None
        item.status = status
        db.commit()
        db.refresh(item)
        return item
