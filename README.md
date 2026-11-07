# University Lost & Found Platform

> **Academic Course Project**: Software Engineering for Cloud Applications  
> **Institution**: Arab Academy for Science, Technology and Maritime Transport (AASTMT)  
> **Architecture**: Full-Stack Decoupled Cloud Architecture (FastAPI + React + PostgreSQL + S3)

---

## 1. Project Overview

**University Lost & Found** is a dedicated web platform designed to streamline lost-and-found operations on university campuses. It allows students, faculty, and administrative staff to:
- **Report Lost Belongings**: Submit detailed descriptions, dates, categories, locations, and optional photos of lost items.
- **Publish Found Items**: Report items found anywhere on campus with clear locations and contact information so rightful owners can reclaim them.
- **Browse & Search**: Easily filter campus reports by report type (`LOST` vs. `FOUND`), category, building location, or keyword search.
- **View Item Details via Modal**: Inspect large item photos, full descriptions, case status (`OPEN` vs. `RETURNED`), and direct owner contact information without leaving the browse view.
- **Track Campus Activity**: View live, persistent statistics directly computed from database records (Total Reports, Active Lost Cases, Active Found Cases, Resolved/Returned Items).

### Scope & Constraints
- **Public Accessibility**: No student login, registration, or password accounts are required.
- **Exactly Three Primary Pages**:
  1. **Home Page (`/`)**: Hero banner, live stats section, latest 6 announcements, and quick call-to-actions.
  2. **Lost & Found Page (`/items`)**: Comprehensive searchable and filterable directory with modal detail dialog and pagination.
  3. **Report an Item Page (`/report`)**: Unified form with report type selector (`I Lost Something` vs. `I Found Something`), client-side validation, and instant confirmation.
- **Secure Status Updates**: Administrative endpoints (`PATCH /api/items/{id}/status`) are protected using a server-side `ADMIN_API_KEY` header.

---

## 2. Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (custom Navy, Gold, and Slate visual identity)
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **Iconography**: Lucide React

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **ORM & Database Toolkit**: SQLAlchemy 2.0 (Declarative Base, 2.0 select syntax)
- **Data Validation & Settings**: Pydantic v2 & Pydantic-Settings
- **Database Migrations**: Alembic
- **PostgreSQL Connectivity**: `psycopg` (v3 binary)
- **Object Storage**: `boto3` for Amazon S3 (with local filesystem fallback for development)
- **Testing**: `pytest`, `pytest-asyncio`, and `httpx`

### Database
- **Primary / Production**: PostgreSQL (Amazon RDS / Local PostgreSQL 18)
- **Development / Test Isolation**: PostgreSQL supported out-of-the-box, with SQLite support for instant local evaluation without requiring external services.

---

## 3. Project Folder Structure

```text
university-lost-and-found/
│
├── backend/
│   ├── alembic/
│   │   ├── versions/
│   │   │   └── 001_create_items_table.py
│   │   ├── env.py
│   │   └── script.py.mako
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py         # Pydantic BaseSettings environment config
│   │   │   └── database.py       # SQLAlchemy 2.0 engine and session factory
│   │   ├── models/
│   │   │   └── item.py           # Item database model and Enums
│   │   ├── schemas/
│   │   │   └── item.py           # Pydantic request/response schemas
│   │   ├── routers/
│   │   │   └── items.py          # FastAPI REST API endpoints
│   │   ├── services/
│   │   │   ├── item_service.py   # Database query and business logic
│   │   │   └── storage_service.py# Local & S3 image storage service
│   │   ├── utils/
│   │   │   └── validators.py     # Validation utilities
│   │   └── main.py               # FastAPI entrypoint, CORS, static mounts
│   ├── scripts/
│   │   └── seed_data.py          # Idempotent database seeder (10 sample items)
│   ├── tests/
│   │   ├── conftest.py           # Pytest fixtures and isolated test DB
│   │   └── test_items.py         # Full test suite covering all 12 criteria
│   ├── uploads/                  # Local storage folder for uploaded images
│   ├── alembic.ini               # Alembic migration configuration
│   ├── requirements.txt          # Python dependencies
│   ├── .env.example              # Environment variables template
│   └── .env                      # Active backend environment file
│
├── frontend/
│   ├── src/
│   │   ├── assets/               # Static assets & images
│   │   ├── components/
│   │   │   ├── Navbar/           # Responsive navigation bar with mobile drawer
│   │   │   ├── Footer/           # Academic footer with course credentials
│   │   │   ├── ItemCard/         # Reusable card with status badges & photo
│   │   │   ├── ItemDetailsModal/ # Modal dialog with backdrop blur & Esc listener
│   │   │   ├── SearchBar/        # Search bar with clear button
│   │   │   ├── FilterBar/        # Tab filters, category & building dropdowns
│   │   │   ├── StatsSection/     # 4 live metric cards
│   │   │   ├── LoadingState/     # Skeleton cards for loading states
│   │   │   ├── EmptyState/       # No-results banner with reset action
│   │   │   ├── ErrorMessage/     # Network error display with retry button
│   │   │   └── ImageUpload/      # Drag & drop photo upload with preview
│   │   ├── pages/
│   │   │   ├── HomePage.tsx      # Landing page with hero & latest items
│   │   │   ├── LostFoundPage.tsx # Directory page with search, filters & pagination
│   │   │   └── ReportItemPage.tsx# Report form for LOST and FOUND belongings
│   │   ├── services/
│   │   │   ├── api.ts            # Centralized Axios instance & URL resolvers
│   │   │   └── itemsService.ts   # Typed API client methods
│   │   ├── types/
│   │   │   └── item.ts           # TypeScript interfaces & campus constants
│   │   ├── App.tsx               # Route configurations and ScrollToTop
│   │   ├── main.tsx              # React DOM entrypoint
│   │   ├── index.css             # Tailwind CSS directives
│   │   └── vite-env.d.ts         # Vite TypeScript environment declarations
│   ├── index.html                # HTML entry template
│   ├── package.json              # NPM dependencies & scripts
│   ├── tailwind.config.js        # Custom Navy & Gold color palette
│   ├── postcss.config.js         # PostCSS configuration
│   ├── tsconfig.json             # TypeScript configuration
│   ├── vite.config.ts            # Vite configuration
│   ├── .env.example              # Frontend environment template
│   └── .env                      # Active frontend environment file
│
├── .gitignore                    # Git ignore file for Python, Node, & uploads
└── README.md                     # Comprehensive project documentation
```

---

## 4. Prerequisites

Before running the application locally, ensure you have installed:
1. **Python 3.11+** (Python 3.13 tested)
2. **Node.js 18+** or **Node.js 20+** (includes `npm`)
3. **PostgreSQL** (Optional for local development; SQLite works out of the box, PostgreSQL / Amazon RDS recommended for production).

---

## 5. PostgreSQL Database Creation (Local or Cloud)

If using a local PostgreSQL server:

1. Open PowerShell or command line as postgres superuser:
```powershell
psql -U postgres
```

2. Create the application database:
```sql
CREATE DATABASE lost_found_db;
```

3. (Optional) Create a dedicated user with permissions:
```sql
CREATE USER lost_found_user WITH PASSWORD 'SecurePassword123!';
GRANT ALL PRIVILEGES ON DATABASE lost_found_db TO lost_found_user;
```

---

## 6. Environment Configuration

### Backend Environment (`backend/.env`)

Copy `backend/.env.example` to `backend/.env`:
```powershell
Copy-Item backend/.env.example backend/.env
```

Default configuration variables:
```env
APP_ENV=development
APP_NAME=University Lost & Found
# PostgreSQL configuration (e.g. Local or Amazon RDS):
# DATABASE_URL=postgresql+psycopg://postgres:password@localhost:5432/lost_found_db
# Out-of-the-box local SQLite fallback:
DATABASE_URL=sqlite:///./lost_found.db
FRONTEND_URL=http://localhost:5173
STORAGE_MODE=local
UPLOAD_DIR=uploads
AWS_REGION=us-east-1
S3_BUCKET_NAME=
ADMIN_API_KEY=supersecretadminapikey123
```

### Frontend Environment (`frontend/.env`)

Copy `frontend/.env.example` to `frontend/.env`:
```powershell
Copy-Item frontend/.env.example frontend/.env
```

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_UPLOADS_BASE_URL=http://localhost:8000
```

---

## 7. Backend Setup & Startup (Windows PowerShell)

1. Open PowerShell and navigate to the project directory:
```powershell
cd university-lost-and-found
```

2. (Optional but recommended) Create and activate a Python virtual environment:
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

3. Install required Python packages:
```powershell
python -m pip install -r backend/requirements.txt
```

4. Run Alembic Database Migrations:
```powershell
cd backend
python -m alembic upgrade head
cd ..
```

5. (Optional) Populate database with realistic sample items:
```powershell
python backend/scripts/seed_data.py
```

6. Start the FastAPI backend server:
```powershell
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
- The backend API will be available at: **http://localhost:8000**
- Interactive Swagger API docs: **http://localhost:8000/docs**
- Health check endpoint: **http://localhost:8000/api/health**

---

## 8. Frontend Setup & Startup (Windows PowerShell)

In a separate terminal window:

1. Navigate to the `frontend` directory:
```powershell
cd university-lost-and-found/frontend
```

2. Install dependencies:
```powershell
npm install
```

3. Start the Vite development server:
```powershell
npm run dev
```
- The application will be running at: **http://localhost:5173**
- Open your browser and navigate to `http://localhost:5173` to explore the website.

4. To build the production bundle:
```powershell
npm run build
```
The optimized static bundle will be generated in `frontend/dist/`.

---

## 9. Running Backend Tests

The project includes an automated test suite verifying all 12 acceptance criteria using `pytest`:

Run tests from the root directory:
```powershell
python -m pytest backend/tests -v
```

### Verified Test Cases:
1. `test_health_check`: Verifies the `/api/health` system monitoring endpoint.
2. `test_create_lost_report`: Confirms creating a lost item with validations.
3. `test_create_found_report_with_image`: Confirms creating a found report with a multipart image file.
4. `test_retrieve_all_reports`: Validates paginated list output.
5. `test_retrieve_item_by_id`: Validates single item retrieval.
6. `test_filter_by_report_type`: Validates filtering by `type=LOST` and `type=FOUND`.
7. `test_search_for_item`: Validates searching keywords across titles and descriptions.
8. `test_pagination`: Tests pagination controls and page limits.
9. `test_get_statistics`: Validates real-time count queries (`/api/items/stats`).
10. `test_invalid_item_submission`: Tests rejecting future dates, short titles, and malformed emails.
11. `test_nonexistent_item_returns_404`: Validates 404 response for missing records.
12. `test_update_item_status_security`: Confirms status modification requires valid `x-admin-api-key`.

---

## 10. API Endpoint Reference

All API endpoints are prefixed with `/api`.

| Method | Endpoint | Description | Query / Body Params | Auth Required |
|---|---|---|---|---|
| `GET` | `/api/health` | Health and storage mode status | None | No |
| `GET` | `/api/items` | Paginated items with filters | `type`, `category`, `location`, `search`, `page`, `limit` | No |
| `GET` | `/api/items/latest` | Latest 6 submitted reports | `limit` (default: 6) | No |
| `GET` | `/api/items/stats` | Real-time database metrics | None | No |
| `GET` | `/api/items/{id}` | Detailed information for one item | `id` (path) | No |
| `POST` | `/api/items` | Submit a new lost or found report | `multipart/form-data` with fields + optional `image` | No |
| `PATCH`| `/api/items/{id}/status`| Update status (`OPEN` or `RETURNED`) | JSON `{"status": "RETURNED"}` + `x-admin-api-key` header | **Yes** (`ADMIN_API_KEY`) |

---

## 11. Image Storage Modes (Local vs. Amazon S3)

The application implements a decoupled storage service pattern (`backend/app/services/storage_service.py`):

### Mode A: Local Development (`STORAGE_MODE=local`)
- Uploaded images are stored in `backend/uploads/` with randomly generated UUID filenames to prevent collisions and filename injection.
- Images are served statically by FastAPI at `http://localhost:8000/uploads/{filename}`.
- Supported file types: `.jpg`, `.jpeg`, `.png`, `.webp`. Maximum size: 5 MB.

### Mode B: Amazon S3 Production (`STORAGE_MODE=s3`)
- Images are automatically uploaded to Amazon S3 via `boto3`.
- Set the following in `backend/.env`:
  ```env
  STORAGE_MODE=s3
  AWS_REGION=us-east-1
  S3_BUCKET_NAME=your-aastmt-lostfound-bucket-name
  ```
- **Security Best Practice**: The application uses the AWS default credential provider chain (IAM Roles on Amazon EC2). No static AWS access keys need to be embedded in the codebase.
- Stored S3 object key: `items/{uuid}.{ext}`.
- Database records store the persistent public S3 URL.

---

## 12. AWS Cloud Deployment Architecture

This project is prepared for deployment on Amazon Web Services for the **Software Engineering for Cloud Applications** course.

```
                      +-------------------------------------------------+
                      |                    Internet                     |
                      +-------------------------------------------------+
                                               |
                                     [Internet Gateway]
                                               |
        +--------------------------------------v--------------------------------------+
        |                         Amazon VPC (10.0.0.0/16)                             |
        |                                                                              |
        |  +------------------------------------------------------------------------+  |
        |  |                     Public Subnet (10.0.1.0/24)                         |  |
        |  |                                                                        |  |
        |  |  +------------------------------------------------------------------+  |  |
        |  |  |                         Amazon EC2                               |  |  |
        |  |  |  +---------------------------+    +---------------------------+  |  |  |
        |  |  |  |       Nginx Web Server    |    |      FastAPI Backend      |  |  |  |
        |  |  |  |  - Serves React dist      |--->|  - Uvicorn / Gunicorn     |  |  |  |
        |  |  |  |  - Reverse proxy /api     |    |  - Port 8000              |  |  |  |
        |  |  |  +---------------------------+    +-------------+-------------+  |  |  |
        |  |  |                    ^                            |                |  |  |
        |  |  |                    | IAM EC2 Role               |                |  |  |
        |  |  +--------------------|----------------------------|----------------+  |  |
        |  +-----------------------|----------------------------|-------------------+  |
        |                          |                            |                      |
        |                          |                            v                      |
        |  +-----------------------|------------------------------------------------+  |
        |  |                       |             Private Subnet (10.0.2.0/24)       |  |
        |  |                       |                                                |  |
        |  |                       |       +-------------------------------------+  |  |
        |  |                       |       |      Amazon RDS (PostgreSQL 16)     |  |  |
        |  |                       |       |  - Accessible only from EC2 SG      |  |  |
        |  |                       |       |  - Port 5432                        |  |  |
        |  |                       |       +-------------------------------------+  |  |
        |  +-----------------------|------------------------------------------------+  |
        +--------------------------|---------------------------------------------------+
                                   v
                      +--------------------------+
                      |      Amazon S3 Bucket    |
                      |  - Uploaded item images  |
                      |  - Public read / IAM put |
                      +--------------------------+
```

### AWS Deployment Plan:

1. **Amazon VPC**:
   - Custom VPC with CIDR `10.0.0.0/16`.
   - Public Subnet (`10.0.1.0/24`) attached to Internet Gateway for EC2.
   - Private Subnets (`10.0.2.0/24`, `10.0.3.0/24` across 2 AZs) for Amazon RDS PostgreSQL.

2. **Amazon RDS for PostgreSQL**:
   - PostgreSQL 16 engine instance inside the private DB subnet group.
   - Security Group rule: Inbound TCP 5432 allowed **only** from the EC2 Security Group.

3. **Amazon EC2 Instance**:
   - Amazon Linux 2023 or Ubuntu 24.04 LTS.
   - Attached IAM Role with `AmazonS3FullAccess` (or scoped S3 PutObject permission on the project bucket).
   - Python 3.11+ running FastAPI via `systemd` and `gunicorn` / `uvicorn`.
   - Nginx serving the built React frontend (`frontend/dist`) on port 80/443 and proxying `/api` requests to `localhost:8000`.

4. **Amazon S3**:
   - Bucket configured with CORS and public read access for uploaded images.
   - EC2 uploads via IAM role authentication.

### Sample Nginx Configuration (`/etc/nginx/conf.d/lostandfound.conf`):
```nginx
server {
    listen 80;
    server_name your-ec2-domain.compute.amazonaws.com;

    # Serve built React frontend static files
    location / {
        root /var/www/university-lost-and-found/frontend/dist;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # Reverse proxy API requests to FastAPI backend
    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Proxy local uploads if not using S3
    location /uploads {
        proxy_pass http://127.0.0.1:8000/uploads;
    }
}
```

---

## 13. Project Team & Academic Credentials

- **Course**: Software Engineering for Cloud Applications
- **University**: Arab Academy for Science, Technology and Maritime Transport (AASTMT)
- **Status**: Production-ready code, tested and validated for local and cloud environments.
