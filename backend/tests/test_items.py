import io
from datetime import date, timedelta
from fastapi.testclient import TestClient
from app.core.config import settings


def test_health_check(client: TestClient):
    """1. Test health check endpoint."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "app" in data


def test_create_lost_report(client: TestClient):
    """2. Test creating a lost report."""
    payload = {
        "title": "Lost Scientific Calculator",
        "description": "Casio fx-991ES black calculator left in Lecture Hall 3",
        "type": "LOST",
        "category": "Electronics",
        "location": "Lecture Hall",
        "item_date": str(date.today() - timedelta(days=1)),
        "contact_name": "Kareem Taha",
        "contact_email": "kareem.taha@student.aast.edu",
        "contact_phone": "+201011122233"
    }
    response = client.post("/api/items", data=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == payload["title"]
    assert data["type"] == "LOST"
    assert data["status"] == "OPEN"
    assert data["id"] is not None


def test_create_found_report_with_image(client: TestClient):
    """3. Test creating a found report with image upload."""
    payload = {
        "title": "Found Car Keys",
        "description": "Found a keychain with Hyundai car key near parking lot A",
        "type": "FOUND",
        "category": "Keys",
        "location": "Parking Area",
        "item_date": str(date.today()),
        "contact_name": "Sara Nabil",
        "contact_email": "sara.nabil@student.aast.edu",
    }
    # Create a small valid test JPEG image
    file_content = b"\xFF\xD8\xFF\xE0\x00\x10JFIF\x00\x01\x01\x01\x00`\x00`\x00\x00\xFF\xDB\x00C\x00\x08\x06\x06\x07\x06\x05\x08\x07\x07\x07\t\t\x08\n\x0c\x14\r\x0c\x0b\x0b\x0c\x19\x12\x13\x0f\x14\x1d\x1a\x1f\x1e\x1d\x1a\x1c\x1c $.' \",#\x1c\x1c(7),01444\x1f'9=82<.342\xFF\xC0\x00\x0b\x08\x00\x01\x00\x01\x01\x01\x11\x00\xFF\xC4\x00\x1f\x00\x00\x01\x05\x01\x01\x01\x01\x01\x01\x00\x00\x00\x00\x00\x00\x00\x00\x01\x02\x03\x04\x05\x06\x07\x08\t\n\x0b\xFF\xDA\x00\x08\x01\x01\x00\x00?\x00\xbf\x00\xFF\xD9"
    files = {
        "image": ("test_keys.jpg", io.BytesIO(file_content), "image/jpeg")
    }

    response = client.post("/api/items", data=payload, files=files)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == payload["title"]
    assert data["type"] == "FOUND"
    assert data["image_url"] is not None
    assert "uploads" in data["image_url"] or "s3" in data["image_url"]


def test_retrieve_all_reports(client: TestClient):
    """4. Test retrieving all reports."""
    # Seed 2 items for this isolated test
    for i in range(2):
        client.post("/api/items", data={
            "title": f"Report Item {i}",
            "description": f"Description for report item {i}",
            "type": "LOST",
            "category": "Accessories",
            "location": "Main Building",
            "item_date": str(date.today()),
            "contact_name": "Test User",
            "contact_email": f"user{i}@student.aast.edu"
        })

    response = client.get("/api/items")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert "page" in data
    assert "total_pages" in data
    assert len(data["items"]) >= 2


def test_retrieve_item_by_id(client: TestClient):
    """5. Test retrieving item by ID."""
    payload = {
        "title": "Lost Blue Water Bottle",
        "description": "Left on desk in computer lab 2",
        "type": "LOST",
        "category": "Other",
        "location": "Laboratory",
        "item_date": str(date.today()),
        "contact_name": "Test User",
        "contact_email": "test@student.aast.edu"
    }
    create_res = client.post("/api/items", data=payload)
    assert create_res.status_code == 201
    item_id = create_res.json()["id"]

    get_res = client.get(f"/api/items/{item_id}")
    assert get_res.status_code == 200
    item_data = get_res.json()
    assert item_data["id"] == item_id
    assert item_data["title"] == payload["title"]


def test_filter_by_report_type(client: TestClient):
    """6. Test filtering by report type (LOST vs FOUND)."""
    # Seed one lost and one found
    client.post("/api/items", data={
        "title": "Type Filter Lost Item",
        "description": "Filter test lost item",
        "type": "LOST",
        "category": "Keys",
        "location": "Cafeteria",
        "item_date": str(date.today()),
        "contact_name": "Lost Student",
        "contact_email": "lost@student.aast.edu"
    })
    client.post("/api/items", data={
        "title": "Type Filter Found Item",
        "description": "Filter test found item",
        "type": "FOUND",
        "category": "Electronics",
        "location": "Library",
        "item_date": str(date.today()),
        "contact_name": "Finder Student",
        "contact_email": "finder@student.aast.edu"
    })

    lost_res = client.get("/api/items?type=LOST")
    assert lost_res.status_code == 200
    lost_data = lost_res.json()
    assert len(lost_data["items"]) >= 1
    for item in lost_data["items"]:
        assert item["type"] == "LOST"

    found_res = client.get("/api/items?type=FOUND")
    assert found_res.status_code == 200
    found_data = found_res.json()
    assert len(found_data["items"]) >= 1
    for item in found_data["items"]:
        assert item["type"] == "FOUND"


def test_search_for_item(client: TestClient):
    """7. Test searching for an item."""
    payload = {
        "title": "Xylophone Musical Notes Folder",
        "description": "Unique binder with sheet music lost in music hall",
        "type": "LOST",
        "category": "Books & Stationery",
        "location": "Main Building",
        "item_date": str(date.today()),
        "contact_name": "Musician Student",
        "contact_email": "music@student.aast.edu"
    }
    client.post("/api/items", data=payload)

    search_res = client.get("/api/items?search=Xylophone")
    assert search_res.status_code == 200
    results = search_res.json()["items"]
    assert len(results) >= 1
    assert any("Xylophone" in item["title"] for item in results)


def test_pagination(client: TestClient):
    """8. Test pagination."""
    # Seed 3 items
    for i in range(3):
        client.post("/api/items", data={
            "title": f"Pagination Item {i}",
            "description": f"Pagination test description {i}",
            "type": "LOST",
            "category": "Other",
            "location": "Campus",
            "item_date": str(date.today()),
            "contact_name": "Pagination User",
            "contact_email": f"page{i}@student.aast.edu"
        })

    response = client.get("/api/items?page=1&limit=2")
    assert response.status_code == 200
    data = response.json()
    assert data["page"] == 1
    assert data["limit"] == 2
    assert len(data["items"]) == 2
    assert data["total"] >= 3
    assert data["total_pages"] >= 2


def test_get_statistics(client: TestClient):
    """9. Test real-time statistics calculation."""
    client.post("/api/items", data={
        "title": "Stats Lost Item",
        "description": "Lost item for stats",
        "type": "LOST",
        "category": "Bags",
        "location": "Library",
        "item_date": str(date.today()),
        "contact_name": "Stats Student",
        "contact_email": "stats@student.aast.edu"
    })
    response = client.get("/api/items/stats")
    assert response.status_code == 200
    stats = response.json()
    assert "total_reports" in stats
    assert "lost_items" in stats
    assert "found_items" in stats
    assert "returned_items" in stats
    assert stats["total_reports"] >= 1
    assert stats["lost_items"] >= 1


def test_invalid_item_submission(client: TestClient):
    """10. Test validation: invalid email, future date, missing fields."""
    invalid_payload = {
        "title": "",
        "description": "Too short",
        "type": "LOST",
        "category": "Keys",
        "location": "Cafeteria",
        "item_date": str(date.today() + timedelta(days=10)),
        "contact_name": "A",
        "contact_email": "not-a-valid-email"
    }
    response = client.post("/api/items", data=invalid_payload)
    assert response.status_code in (400, 422)


def test_nonexistent_item_returns_404(client: TestClient):
    """11. Test nonexistent item returns 404."""
    response = client.get("/api/items/999999")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_update_item_status_security(client: TestClient):
    """12 & 13. Test status update with valid and invalid admin API key."""
    payload = {
        "title": "Item to update status",
        "description": "Testing status change security",
        "type": "FOUND",
        "category": "Accessories",
        "location": "Cafeteria",
        "item_date": str(date.today()),
        "contact_name": "Admin Tester",
        "contact_email": "admin@student.aast.edu"
    }
    item_id = client.post("/api/items", data=payload).json()["id"]

    # 1. Reject without API key
    res_no_key = client.patch(f"/api/items/{item_id}/status", json={"status": "RETURNED"})
    assert res_no_key.status_code == 403

    # 2. Reject with wrong API key
    res_wrong_key = client.patch(
        f"/api/items/{item_id}/status",
        json={"status": "RETURNED"},
        headers={"x-admin-api-key": "invalid-wrong-key"}
    )
    assert res_wrong_key.status_code == 403

    # 3. Allow with valid API key
    res_valid_key = client.patch(
        f"/api/items/{item_id}/status",
        json={"status": "RETURNED"},
        headers={"x-admin-api-key": settings.ADMIN_API_KEY}
    )
    assert res_valid_key.status_code == 200
    assert res_valid_key.json()["status"] == "RETURNED"
