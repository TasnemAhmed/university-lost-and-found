import sys
from datetime import date, timedelta
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from sqlalchemy import select
from app.core.database import SessionLocal, engine, Base
from app.models.item import Item, ItemType, ItemStatus


SAMPLE_ITEMS = [
    {
        "title": "Lost Black Leather Wallet",
        "description": "Black Tommy Hilfiger leather bi-fold wallet containing student ID card and transport pass. Lost near the cafeteria cash register during lunch hour.",
        "type": ItemType.LOST,
        "category": "Accessories",
        "location": "Cafeteria",
        "item_date": date.today() - timedelta(days=1),
        "contact_name": "Omar Hassan",
        "contact_email": "omar.hassan@student.aast.edu",
        "contact_phone": "+201012345678",
        "status": ItemStatus.OPEN,
        "image_url": "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80"
    },
    {
        "title": "Found iPhone 14 Pro (Space Black)",
        "description": "Found on table 12 in the Central Library 2nd floor reading hall. Phone has a clear case with a sticker on the back. Battery was at 45%. Handed to library front desk.",
        "type": ItemType.FOUND,
        "category": "Electronics",
        "location": "Library",
        "item_date": date.today() - timedelta(days=2),
        "contact_name": "Laila Mahmoud",
        "contact_email": "laila.m@student.aast.edu",
        "contact_phone": "+201098765432",
        "status": ItemStatus.OPEN,
        "image_url": "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80"
    },
    {
        "title": "Lost AASTMT Student ID Card",
        "description": "Lost College of Computing and Information Technology student card under registration number 20104822. Please contact me urgently if found.",
        "type": ItemType.LOST,
        "category": "ID Cards",
        "location": "Student Affairs",
        "item_date": date.today() - timedelta(days=3),
        "contact_name": "Ahmed Mostafa",
        "contact_email": "ahmed.mostafa@student.aast.edu",
        "contact_phone": "+201122334455",
        "status": ItemStatus.OPEN,
        "image_url": "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80"
    },
    {
        "title": "Found Navy Blue Herschel Backpack",
        "description": "Left on bench in front of Main Building entrance. Contains spiral notebooks, pens, and a blue water bottle. Clean condition.",
        "type": ItemType.FOUND,
        "category": "Bags",
        "location": "Main Building",
        "item_date": date.today() - timedelta(days=2),
        "contact_name": "Mariam Ali",
        "contact_email": "mariam.ali@student.aast.edu",
        "contact_phone": "+201234567890",
        "status": ItemStatus.OPEN,
        "image_url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80"
    },
    {
        "title": "Lost Sony WH-1000XM4 Wireless Headphones",
        "description": "Silver/Platinum Sony noise-canceling headphones inside their original grey carrying case. Accidentally left on the 3rd row desk of Lecture Hall 204.",
        "type": ItemType.LOST,
        "category": "Electronics",
        "location": "Lecture Hall",
        "item_date": date.today() - timedelta(days=4),
        "contact_name": "Youssef Ibrahim",
        "contact_email": "youssef.i@student.aast.edu",
        "contact_phone": "+201055566677",
        "status": ItemStatus.OPEN,
        "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
    },
    {
        "title": "Found Calculus & Linear Algebra Spiral Notebook",
        "description": "A4 grid notebook with comprehensive lecture notes, problem sets, and formulas. Name on inside cover partially smudged. Found in Lab 302.",
        "type": ItemType.FOUND,
        "category": "Books & Stationery",
        "location": "Laboratory",
        "item_date": date.today() - timedelta(days=1),
        "contact_name": "Nour Tarek",
        "contact_email": "nour.tarek@student.aast.edu",
        "contact_phone": None,
        "status": ItemStatus.OPEN,
        "image_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80"
    },
    {
        "title": "Lost Toyota Car Key with Red Keychain",
        "description": "Electronic key fob for a Toyota Corolla with a red silicone wrist lanyard and an apartment tag. Fell from jacket pocket in Lot B.",
        "type": ItemType.LOST,
        "category": "Keys",
        "location": "Parking Area",
        "item_date": date.today() - timedelta(days=5),
        "contact_name": "Karim Adel",
        "contact_email": "karim.adel@student.aast.edu",
        "contact_phone": "+201144778899",
        "status": ItemStatus.OPEN,
        "image_url": "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80"
    },
    {
        "title": "Found Black Hydro Flask Water Bottle (32oz)",
        "description": "Matte black insulated water bottle with stickers (GitHub, NASA, Docker). Found on the bleachers after volleyball practice.",
        "type": ItemType.FOUND,
        "category": "Other",
        "location": "Main Building",
        "item_date": date.today() - timedelta(days=2),
        "contact_name": "Salma Farouk",
        "contact_email": "salma.farouk@student.aast.edu",
        "contact_phone": None,
        "status": ItemStatus.OPEN,
        "image_url": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80"
    },
    {
        "title": "Lost Ray-Ban Aviator Sunglasses in Case",
        "description": "Gold framed polarized sunglasses inside a brown leather case. Likely left in the outdoor seating pavilion outside building C.",
        "type": ItemType.LOST,
        "category": "Accessories",
        "location": "Cafeteria",
        "item_date": date.today() - timedelta(days=6),
        "contact_name": "Ziad Amr",
        "contact_email": "ziad.amr@student.aast.edu",
        "contact_phone": "+201066778899",
        "status": ItemStatus.RETURNED,
        "image_url": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80"
    },
    {
        "title": "Found Casio FX-991EX Scientific Calculator",
        "description": "Black and white scientific calculator with battery and solar cell. Left on instructor podium in Hall 101 after electrical circuits exam.",
        "type": ItemType.FOUND,
        "category": "Electronics",
        "location": "Lecture Hall",
        "item_date": date.today() - timedelta(days=3),
        "contact_name": "Dina Ezzat",
        "contact_email": "dina.ezzat@student.aast.edu",
        "contact_phone": "+201299887766",
        "status": ItemStatus.RETURNED,
        "image_url": "https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48f?auto=format&fit=crop&w=600&q=80"
    }
]


def seed_database():
    """Seeds sample data idempotently without creating duplicates."""
    print("Initializing database tables...")
    Base.metadata.create_all(bind=engine)

    session = SessionLocal()
    inserted_count = 0
    skipped_count = 0

    try:
        for data in SAMPLE_ITEMS:
            # Check if item with exact same title already exists
            existing = session.scalar(
                select(Item).where(Item.title == data["title"])
            )
            if existing:
                skipped_count += 1
                continue

            item = Item(**data)
            session.add(item)
            inserted_count += 1

        session.commit()
        print(f"Seed complete! Inserted: {inserted_count}, Skipped (existing): {skipped_count}")
    except Exception as e:
        session.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        session.close()


if __name__ == "__main__":
    seed_database()
