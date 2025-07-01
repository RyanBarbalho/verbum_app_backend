# Verbum Bible API

A NestJS-based REST API for accessing Bible data with books, chapters, and verses.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- Docker & Docker Compose
- Git

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd verbum_app_backend
npm install
```

### 2. Start the System
```bash
# Start all services (API + PostgreSQL + pgAdmin)
docker-compose up -d
```

### 3. Seed the Database
```bash
# Populate with Bible data
npm run seed:bible
```

> **💡 Database Persistence:** The data persists between container restarts thanks to Docker volumes. You only need to seed once unless you run `docker-compose down -v` (which removes the volume).

### 4. Test the API
```bash
# Get all books
curl http://localhost:3000/bible/books

# Get a specific book
curl "http://localhost:3000/bible/books/name/G%C3%AAnesis"

# Get chapters of a book
curl http://localhost:3000/bible/books/{bookId}/chapters
```

## 🗄️ Database Access

### pgAdmin Options

#### **Option 1: pgAdmin Web (Docker)**
- **URL:** http://localhost:5050
- **Email:** admin@admin.com
- **Password:** admin

#### **Option 2: pgAdmin Desktop (Standalone)**
- **Download:** https://www.pgadmin.org/download/
- **Install:** Follow the installation guide for your OS

#### **Step-by-step pgAdmin Setup:**
1. **Open pgAdmin** (Desktop app or browser at http://localhost:5050)
2. **Login:** Email: `admin@admin.com`, Password: `admin` (if using web version)
3. **Add Server:**
   - Right-click "Servers" → "Register" → "Server"
   - **General tab:** Name: `Verbum DB` (or any name)
   - **Connection tab:**
     - Host: `localhost`
     - Port: `5432`
     - Database: `verbum_db`
     - Username: `postgres`
     - Password: `123`
   - Click "Save"
4. **Test Connection:** You should see your database in the left panel

### Cursor IDE Database Browser
- **Host:** localhost
- **Port:** 5432
- **Database:** verbum_db
- **Username:** postgres
- **Password:** 123

#### **Step-by-step Cursor Setup:**
1. **Open Database Panel:** Click database icon in left sidebar
2. **Add Connection:** Click "+" → Select "PostgreSQL"
3. **Connection Details:**
   - Host: `localhost`
   - Port: `5432`
   - Database: `verbum_db`
   - Username: `postgres`
   - Password: `123`
4. **Test & Connect:** Click "Test Connection" → "Connect"

### Command Line
```bash
# Connect to PostgreSQL container
docker exec -it verbum_app_backend-db-1 psql -U postgres -d verbum_db
```

#### **Useful SQL Commands:**
```sql
-- List all tables
\dt

-- View table structure
\d books
\d chapters
\d verses

-- Check data counts
SELECT COUNT(*) FROM books;
SELECT COUNT(*) FROM chapters;
SELECT COUNT(*) FROM verses;

-- Check relationships
SELECT b.name, COUNT(c.id) as chapter_count 
FROM books b 
LEFT JOIN chapters c ON b.id = c."bookId" 
GROUP BY b.id, b.name;
```

## 🔧 Development

### Available Scripts
```bash
# Development
npm run start:dev          # Start with hot reload
npm run start:debug        # Start with debug mode

# Database
npm run seed:bible         # Seed Bible data
npm run docker:up          # Start containers
npm run docker:down        # Stop containers

# Testing
npm run test               # Unit tests
npm run test:e2e           # E2E tests
```

### Reset Database
```bash
# Option 1: Using pgAdmin
# Right-click verbum_db → Delete → Create new database

# Option 2: Using SQL
DROP DATABASE IF EXISTS verbum_db;
CREATE DATABASE verbum_db;

# Option 3: Nuclear reset (removes all data permanently)
docker-compose down -v
docker-compose up -d
npm run seed:bible
```

### Test API
```bash
# Install axios for testing
npm install axios

# Run the test script
node test-api.js
```

### Automated Testing
```bash
# Unit tests
npm run test          # Run all unit tests
npm run test:watch    # Run tests in watch mode
npm run test:cov      # Run tests with coverage

# End-to-End tests (requires app to be running)
npm run test:e2e
```

## 📚 API Endpoints

### Books
- `GET /bible/books` - Get all books
- `GET /bible/books/:id` - Get book by ID
- `GET /bible/books/name/:name` - Get book by name
- `GET /bible/books/abbreviation/:abbr` - Get book by abbreviation
- `GET /bible/books/testament/:testament` - Get books by testament (old/new)

### Chapters
- `GET /bible/books/:bookId/chapters` - Get chapters of a book
- `GET /bible/chapters/:id` - Get chapter by ID
- `GET /bible/books/:bookId/chapters/:number` - Get chapter by book and number

### Verses
- `GET /bible/chapters/:chapterId/verses` - Get verses of a chapter
- `GET /bible/verses/:id` - Get verse by ID
- `GET /bible/books/:bookId/chapters/:chapterNumber/verses/:verseNumber` - Get verse by reference

### Full Content
- `GET /bible/books/:bookId/full` - Get full book with all chapters and verses
- `GET /bible/books/:bookId/chapters/:chapterNumber/full` - Get full chapter with all verses

### Search
- `GET /bible/search?q=:query` - Search verses by text

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check if containers are running
docker ps

# Check container logs
docker-compose logs db
docker-compose logs api

# Restart containers
docker-compose restart
```

### URL Encoding for Accented Characters
For book names with accents, use URL encoding:
- `Gênesis` → `G%C3%AAnesis`
- `Êxodo` → `%C3%8Axodo`

### Reset Everything
```bash
# Complete reset
docker-compose down -v
docker-compose up -d
npm run seed:bible
```

## 📁 Project Structure
```
src/
├── bible/                 # Bible module
│   ├── entities/         # Database entities
│   ├── dto/             # Data transfer objects
│   ├── *.service.ts     # Business logic
│   └── *.controller.ts  # API endpoints
├── database/
│   └── seed/            # Database seeding
└── config/              # Configuration files
```

## 🔗 Technologies
- **Framework:** NestJS
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Containerization:** Docker & Docker Compose
- **Database GUI:** pgAdmin
