# Admin Panel - Product Management System

Fullstack admin panel untuk manajemen data **Categories** dan **Products** dengan fitur autentikasi JWT, CRUD lengkap, pencarian, pagination, dan halaman detail.

## Tech Stack

| Layer    | Teknologi                                                   |
| -------- | ----------------------------------------------------------- |
| Frontend | React 19, TypeScript, Vite, TailwindCSS 4, Zustand, Axios   |
| Backend  | NestJS 11, TypeScript, Sequelize ORM, Passport JWT, Swagger |
| Database | MySQL                                                       |

---

## Desain Database

```
┌──────────────────────┐       ┌──────────────────────────┐
│     categories       │       │        products           │
├──────────────────────┤       ├──────────────────────────┤
│ id          INT (PK) │──┐    │ id            INT (PK)   │
│ name        VARCHAR  │  │    │ category_id   INT (FK)   │◄─┐
│ description TEXT     │  │    │ name          VARCHAR    │  │
│ is_active   BOOLEAN  │  │    │ description   TEXT       │  │
│ created_at  DATETIME │  │    │ price         DECIMAL    │  │
│ updated_at  DATETIME │  │    │ stock         INT        │  │
└──────────────────────┘  │    │ is_active     BOOLEAN    │  │
                          │    │ created_at    DATETIME   │  │
                          │    │ updated_at    DATETIME   │  │
                          │    └──────────────────────────┘  │
                          │                                   │
                          └───── One to Many ─────────────────┘
                          (1 Category → banyak Products)
```

**Relasi:** `categories` → `products` (One to Many)

- 1 category memiliki banyak products
- 1 product hanya milik 1 category
- Foreign key: `products.category_id` → `categories.id`

### ERD Diagram

```
categories ||--o{ products : "has many"
```

### Tabel Users (untuk autentikasi)

```
┌──────────────────────┐
│       users          │
├──────────────────────┤
│ id          INT (PK) │
│ email       VARCHAR  │
│ password    VARCHAR  │
│ name        VARCHAR  │
│ role        VARCHAR  │
│ is_active   BOOLEAN  │
│ created_at  DATETIME │
│ updated_at  DATETIME │
└──────────────────────┘
```

---

## Fitur Aplikasi

### Autentikasi

- Login dengan email & password
- JWT token-based authentication
- Protected routes (semua halaman admin butuh login)
- Auto-redirect ke login jika token expired

### CRUD Categories

- List categories dengan pagination & search
- Detail category (menampilkan info + daftar products dalam category)
- Tambah, edit, hapus category
- Validasi: tidak bisa hapus category yang masih punya products

### CRUD Products

- List products dengan pagination, search, & filter by category
- Detail product (info lengkap + link ke category)
- Tambah, edit, hapus product
- Format harga otomatis ke Rupiah

### Fitur Umum

- Pencarian data (search) di semua tabel
- Pagination di semua list response
- Loading skeleton saat data dimuat
- Toast notification untuk feedback user
- Responsive UI (mobile-friendly)
- Error boundary untuk menangkap error React

---

## Arsitektur & Pattern

### MVC Pattern (Backend - NestJS)

```
backend/src/modules/{module}/
├── controllers/    → [C] Controller : Handle HTTP request/response
├── services/       → [C] Service    : Business logic (pengganti tradisional Controller logic)
├── models/         → [M] Model      : Representasi tabel database (Sequelize)
├── dto/            → Data Transfer Object : Validasi input
```

**Penjelasan:**

- **Model** (`models/`): Definisi tabel database menggunakan Sequelize decorators (`@Table`, `@Column`, `@HasMany`, `@BelongsTo`)
- **View**: Di fullstack app, View digantikan oleh **React frontend** yang mengonsumsi REST API
- **Controller** (`controllers/`): Menerima HTTP request, memanggil service, mengembalikan response. Di NestJS, logic bisnis dipindahkan ke Service layer untuk separation of concerns
- **Service** (`services/`): Berisi business logic (query database, validasi relasi, transformasi data)

### Error Handling

**Backend:**

| Layer                   | Handling                                                             |
| ----------------------- | -------------------------------------------------------------------- |
| Global Exception Filter | Menangkap SEMUA error (HttpException, Database Error, Generic Error) |
| ValidationPipe          | Validasi otomatis input DTO (class-validator)                        |
| Service Layer           | NotFoundException, ConflictException, UnauthorizedException          |
| Database Errors         | SequelizeUniqueConstraint, ForeignKey, Validation, Connection Error  |

**Frontend:**

| Layer             | Handling                                          |
| ----------------- | ------------------------------------------------- |
| ErrorBoundary     | Tangkap error React yang tidak terduga            |
| Axios Interceptor | Auto-redirect ke login jika 401                   |
| getErrorMessage   | Utility extract pesan error dari API response     |
| Toast             | Feedback visual untuk setiap aksi user            |
| Form Validation   | Validasi client-side dengan Zod + React Hook Form |

**Format Response API (standar):**

```json
// Success
{
  "statusCode": 200,
  "message": "Success",
  "data": { ... }
}

// Error
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "BAD_REQUEST",
  "details": [{ "field": "name", "message": "Nama wajib diisi" }],
  "timestamp": "2026-02-07T..."
}
```

---

## Dependency

### Backend

| Package              | Fungsi                               |
| -------------------- | ------------------------------------ |
| @nestjs/core         | Framework utama NestJS               |
| @nestjs/config       | Manajemen environment variable       |
| @nestjs/jwt          | Generate & verifikasi JWT token      |
| @nestjs/passport     | Integrasi Passport.js authentication |
| @nestjs/sequelize    | ORM integration dengan NestJS        |
| @nestjs/swagger      | Auto-generate API documentation      |
| sequelize            | ORM untuk query database MySQL       |
| sequelize-typescript | Decorator TypeScript untuk Sequelize |
| mysql2               | Driver MySQL                         |
| bcrypt               | Hashing password                     |
| class-validator      | Validasi DTO                         |
| class-transformer    | Transform tipe data DTO              |
| passport-jwt         | Strategy JWT untuk Passport          |

### Frontend

| Package             | Fungsi                           |
| ------------------- | -------------------------------- |
| react               | Library UI                       |
| react-router-dom    | Client-side routing & navigation |
| axios               | HTTP client untuk consume API    |
| zustand             | State management (auth store)    |
| react-hook-form     | Form handling & validation       |
| zod                 | Schema validation (form)         |
| @hookform/resolvers | Integrasi Zod + React Hook Form  |
| tailwindcss         | Utility-first CSS framework      |
| lucide-react        | Icon library                     |
| react-hot-toast     | Toast notification               |

---

## Cara Menjalankan

### Prasyarat

- Node.js >= 18
- MySQL >= 8.0
- npm atau yarn

### 1. Setup Database

```sql
CREATE DATABASE admin_panel;
```

### 2. Backend

```bash
cd backend

# Install dependencies
npm install

# Buat file .env
cp .env.example .env
# Isi konfigurasi database:
# DB_HOST=localhost
# DB_PORT=3306
# DB_USERNAME=root
# DB_PASSWORD=
# DB_NAME=admin_panel
# JWT_SECRET=your_secret_key
# JWT_EXPIRES_IN=24h

# Jalankan server (development)
npm run start:dev
```

Server berjalan di `http://localhost:3001`
Swagger docs: `http://localhost:3001/api`

### 3. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Frontend berjalan di `http://localhost:5173`

### 4. Akun Default

Seeder otomatis membuat akun admin saat pertama kali dijalankan:

| Email             | Password    |
| ----------------- | ----------- |
| admin@example.com | password123 |

---

## Struktur API Endpoints

| Method | Endpoint               | Auth | Deskripsi                   |
| ------ | ---------------------- | ---- | --------------------------- |
| POST   | /api/v1/auth/login     | -    | Login, mendapat JWT token   |
| POST   | /api/v1/auth/register  | -    | Register user baru          |
| GET    | /api/v1/auth/profile   | JWT  | Ambil profil user           |
| GET    | /api/v1/categories     | JWT  | List categories (paginated) |
| GET    | /api/v1/categories/:id | JWT  | Detail category             |
| POST   | /api/v1/categories     | JWT  | Buat category baru          |
| PATCH  | /api/v1/categories/:id | JWT  | Update category             |
| DELETE | /api/v1/categories/:id | JWT  | Hapus category              |
| GET    | /api/v1/products       | JWT  | List products (paginated)   |
| GET    | /api/v1/products/:id   | JWT  | Detail product              |
| POST   | /api/v1/products       | JWT  | Buat product baru           |
| PATCH  | /api/v1/products/:id   | JWT  | Update product              |
| DELETE | /api/v1/products/:id   | JWT  | Hapus product               |

**Query Parameters (GET list):**

- `page` - Halaman ke- (default: 1)
- `limit` - Jumlah data per halaman (default: 10)
- `search` - Kata kunci pencarian nama
- `categoryId` - Filter products berdasarkan category (hanya di products)

---

## Screenshot Aplikasi

> ⚠️ Tambahkan screenshot berikut setelah menjalankan aplikasi:

1. **Login Page** - Halaman login dengan form email & password
2. **Dashboard** - Overview dengan statistik categories & products
3. **Categories List** - Tabel categories dengan search, pagination, tombol CRUD
4. **Category Detail** - Detail category beserta daftar products di dalamnya
5. **Products List** - Tabel products dengan search, filter category, pagination
6. **Product Detail** - Detail product dengan info harga, stock, dan category

---

## Catatan untuk Developer Selanjutnya

1. **Database auto-sync**: Saat development, tabel otomatis disinkronkan dari model Sequelize. Di production, matikan `synchronize: true` di `database.config.ts` dan gunakan migration.
2. **Seeder**: Data awal (admin, categories, products) otomatis di-seed saat pertama kali server dijalankan. Cek `database/seeders/initial.seeder.ts`.
3. **Swagger**: Dokumentasi API tersedia otomatis di `/api` saat server berjalan.
4. **Environment**: Semua konfigurasi sensitif (DB, JWT) menggunakan `.env` file.
5. **CORS**: Sudah dikonfigurasi untuk `localhost:5173` (Vite) dan `localhost:3000`.
6. **Postman Collection**: File collection tersedia di `docs/api/postman_collection.json`.
