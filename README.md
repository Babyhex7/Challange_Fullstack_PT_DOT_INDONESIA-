<div align="center">

# Admin Panel - Sistem Manajemen Produk

Aplikasi admin panel fullstack untuk mengelola data **Categories** dan **Products**. Dibangun dengan teknologi web modern, dilengkapi autentikasi JWT, operasi CRUD lengkap, fitur pencarian, pagination, dan halaman detail.

![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)

<br />

![Preview Aplikasi](docs/screenshots/dashboard.png)

[Fitur](#fitur) · [Screenshot](#screenshot) · [Cara Menjalankan](#cara-menjalankan) · [Dokumentasi API](#dokumentasi-api) · [Arsitektur](#arsitektur)

</div>

---

## Daftar Isi

- [Screenshot](#screenshot)
- [Fitur](#fitur)
- [Tech Stack](#tech-stack)
- [Prasyarat](#prasyarat)
- [Cara Menjalankan](#cara-menjalankan)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Setup Database](#2-setup-database)
  - [3. Setup Backend](#3-setup-backend)
  - [4. Setup Frontend](#4-setup-frontend)
  - [5. Akun Default](#5-akun-default)
- [Struktur Projek](#struktur-projek)
- [Dokumentasi API](#dokumentasi-api)
  - [Autentikasi](#autentikasi)
  - [Categories](#categories)
  - [Products](#products)
  - [Query Parameters](#query-parameters)
  - [Format Response](#format-response)
- [Arsitektur](#arsitektur)
  - [Backend (Pola MVC)](#backend-pola-mvc)
  - [Frontend](#arsitektur-frontend)
  - [Desain Database](#desain-database)
- [Penanganan Error](#penanganan-error)
- [Dependencies](#dependencies)
- [Environment Variables](#environment-variables)
- [Script yang Tersedia](#script-yang-tersedia)
- [Catatan Deployment](#catatan-deployment)
- [Troubleshooting](#troubleshooting)
- [Kontribusi](#kontribusi)
- [Lisensi](#lisensi)

---

## Screenshot

### Halaman Login

Halaman login menampilkan desain split-layout yang modern — ilustrasi branding di sebelah kiri dan form login yang bersih di sebelah kanan. Validasi form dilakukan di sisi client menggunakan Zod sebelum request dikirim ke server.

![Halaman Login](docs/screenshots/login.png)

### Dashboard

Dashboard menampilkan ringkasan data dengan kartu statistik yang menunjukkan total categories, total products, jumlah admin users, dan status API. Desain berbasis kartu dengan aksen gradien dan tombol navigasi cepat.

![Dashboard](docs/screenshots/dashboard.png)

---

## Fitur

### Autentikasi & Keamanan

- Autentikasi berbasis JWT dengan waktu kadaluarsa yang dapat dikonfigurasi
- Password di-hash menggunakan bcrypt (10 salt rounds)
- Protected routes — semua halaman admin membutuhkan token valid
- Redirect otomatis ke halaman login ketika token kadaluarsa
- Integrasi Passport.js strategy untuk kemudahan pengembangan

### Categories (CRUD)

- Menampilkan daftar categories dengan pagination dan pencarian
- Melihat detail category beserta daftar products di dalamnya
- Membuat category baru melalui form modal dengan validasi
- Mengedit category yang sudah ada
- Menghapus category dengan pengecekan — tidak bisa dihapus jika masih memiliki products

### Products (CRUD)

- Menampilkan daftar products dengan pagination, pencarian nama, dan filter berdasarkan category
- Melihat detail product dengan info harga, stok, deskripsi, dan link ke category
- Membuat/mengedit products dengan validasi form (nama, category, harga, stok)
- Format harga otomatis ke format Rupiah
- Menghapus products dengan modal konfirmasi

### Pengalaman Pengguna

- Loading skeleton saat data sedang dimuat
- Notifikasi toast untuk setiap aksi pengguna (sukses/error)
- Layout responsif (mobile, tablet, desktop)
- Desain UI modern dengan sudut rounded dan aksen gradien
- React Error Boundary untuk menangani crash yang tidak terduga
- Navigasi sidebar yang smooth dengan highlight route aktif

---

## Tech Stack

| Layer        | Teknologi                                                                         |
| ------------ | --------------------------------------------------------------------------------- |
| **Frontend** | React 19, TypeScript, Vite 7, TailwindCSS 4, Zustand, Axios, React Hook Form, Zod |
| **Backend**  | NestJS 11, TypeScript, Sequelize ORM, Passport JWT, Swagger (OpenAPI)             |
| **Database** | MySQL 8.0                                                                         |

---

## Prasyarat

Sebelum memulai, pastikan software berikut sudah terinstal di komputer kamu:

| Software    | Versi Minimum | Link Download                                 |
| ----------- | ------------: | --------------------------------------------- |
| **Node.js** |          18.x | [nodejs.org](https://nodejs.org/)             |
| **npm**     |           9.x | Sudah termasuk dalam Node.js                  |
| **MySQL**   |           8.0 | [mysql.com](https://dev.mysql.com/downloads/) |
| **Git**     |           2.x | [git-scm.com](https://git-scm.com/)           |

Verifikasi instalasi dengan menjalankan perintah berikut:

```bash
node -v    # Harus menampilkan v18.x.x atau lebih tinggi
npm -v     # Harus menampilkan 9.x.x atau lebih tinggi
mysql --version
git --version
```

---

## Cara Menjalankan

### 1. Clone Repository

```bash
git clone https://github.com/your-username/admin-panel.git
cd admin-panel
```

### 2. Setup Database

Buka MySQL client (MySQL Workbench, terminal, atau GUI lainnya) dan buat database:

```sql
CREATE DATABASE admin_panel;
```

> Tabel akan dibuat secara otomatis saat server backend dijalankan — Sequelize akan menyinkronkan tabel berdasarkan definisi model.

### 3. Setup Backend

```bash
# Masuk ke direktori backend
cd backend

# Install semua dependencies
npm install

# Buat file environment
cp .env.example .env
```

Sekarang buka file `.env` dan isi kredensial database kamu:

```env
# Konfigurasi Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password_mysql_kamu
DB_NAME=admin_panel

# Konfigurasi JWT
JWT_SECRET=secret_key_kamu_yang_panjang_dan_aman
JWT_EXPIRES_IN=24h

# Server
PORT=3001
```

> **Penting:** Ganti `JWT_SECRET` dengan string acak yang kuat di production. Jangan pernah commit file `.env` ke version control.

Jalankan server development:

```bash
npm run start:dev
```

Jika semua sudah benar, kamu akan melihat output:

```
Server berjalan di http://localhost:3001
Swagger docs di http://localhost:3001/api/docs
✅ Seeder: User admin berhasil dibuat
✅ Seeder: Categories berhasil dibuat
✅ Seeder: Products berhasil dibuat
```

Backend sekarang berjalan di **http://localhost:3001** dan dokumentasi Swagger tersedia di **http://localhost:3001/api/docs**.

### 4. Setup Frontend

Buka terminal baru:

```bash
# Masuk ke direktori frontend
cd frontend

# Install semua dependencies
npm install

# Jalankan server development
npm run dev
```

Frontend sekarang berjalan di **http://localhost:5173**. Buka URL ini di browser kamu.

### 5. Akun Default

Saat backend pertama kali dijalankan, seeder otomatis membuat akun admin default beserta data contoh (5 categories dan 13 products):

| Field    | Nilai               |
| -------- | ------------------- |
| Email    | `admin@example.com` |
| Password | `password123`       |

Gunakan kredensial ini untuk login dan menjelajahi aplikasi.

---

## Struktur Projek

```
.
├── backend/                    # Server API NestJS
│   ├── src/
│   │   ├── main.ts             # Entry point, bootstrap, setup Swagger
│   │   ├── app.module.ts       # Root module
│   │   ├── common/             # Utilitas bersama
│   │   │   ├── filters/        # Global exception filter
│   │   │   ├── guards/         # JWT authentication guard
│   │   │   └── interceptors/   # Response transformation interceptor
│   │   ├── config/             # Konfigurasi Database & JWT
│   │   ├── database/           # Database module & seeders
│   │   └── modules/
│   │       ├── auth/           # Autentikasi (login, register, JWT)
│   │       ├── categories/     # Module CRUD Categories
│   │       ├── products/       # Module CRUD Products
│   │       └── users/          # Module manajemen User
│   ├── test/                   # E2E tests
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── main.tsx            # React entry point
│   │   ├── App.tsx             # Setup Router & layout
│   │   ├── components/
│   │   │   ├── auth/           # Komponen ProtectedRoute
│   │   │   ├── layout/         # Header, Sidebar, MainLayout
│   │   │   └── ui/             # UI reusable (Pagination, DeleteModal)
│   │   ├── pages/              # Komponen halaman (Dashboard, CRUD pages)
│   │   ├── services/           # Layer service API (panggilan Axios)
│   │   ├── store/              # Zustand state management
│   │   ├── types/              # Definisi tipe TypeScript
│   │   └── utils/              # Fungsi utilitas
│   ├── package.json
│   └── vite.config.ts
│
├── docs/
│   ├── api/                    # Postman collection
│   └── screenshots/            # Screenshot aplikasi
│
└── README.md
```

---

## Dokumentasi API

API mengikuti konvensi RESTful dan menggunakan prefix versi `/api/v1`. Semua response dibungkus dalam format standar (lihat [Format Response](#format-response)).

Dokumentasi Swagger interaktif tersedia di **http://localhost:3001/api/docs** saat server berjalan. Kamu juga bisa mengimpor Postman collection dari `docs/api/postman_collection.json`.

### Autentikasi

| Method | Endpoint                | Auth  | Deskripsi                                              |
| ------ | ----------------------- | ----- | ------------------------------------------------------ |
| POST   | `/api/v1/auth/login`    | Tidak | Login dengan email & password, mengembalikan token JWT |
| POST   | `/api/v1/auth/register` | Tidak | Mendaftarkan akun user baru                            |
| GET    | `/api/v1/auth/profile`  | JWT   | Mendapatkan profil user yang sedang login              |

**Contoh Login:**

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "password123"}'
```

**Response:**

```json
{
  "statusCode": 200,
  "message": "Login berhasil",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "email": "admin@example.com",
      "name": "Admin",
      "role": "admin"
    }
  }
}
```

Gunakan `access_token` yang dikembalikan sebagai Bearer token di request selanjutnya:

```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  http://localhost:3001/api/v1/categories
```

### Categories

| Method | Endpoint                 | Auth | Deskripsi                             |
| ------ | ------------------------ | ---- | ------------------------------------- |
| GET    | `/api/v1/categories`     | JWT  | Daftar categories (dengan pagination) |
| GET    | `/api/v1/categories/:id` | JWT  | Detail category                       |
| POST   | `/api/v1/categories`     | JWT  | Membuat category baru                 |
| PATCH  | `/api/v1/categories/:id` | JWT  | Mengupdate category                   |
| DELETE | `/api/v1/categories/:id` | JWT  | Menghapus category                    |

**Contoh Membuat Category:**

```bash
curl -X POST http://localhost:3001/api/v1/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name": "Furniture", "description": "Furniture rumah dan kantor"}'
```

### Products

| Method | Endpoint               | Auth | Deskripsi                           |
| ------ | ---------------------- | ---- | ----------------------------------- |
| GET    | `/api/v1/products`     | JWT  | Daftar products (dengan pagination) |
| GET    | `/api/v1/products/:id` | JWT  | Detail product                      |
| POST   | `/api/v1/products`     | JWT  | Membuat product baru                |
| PATCH  | `/api/v1/products/:id` | JWT  | Mengupdate product                  |
| DELETE | `/api/v1/products/:id` | JWT  | Menghapus product                   |

**Contoh Membuat Product:**

```bash
curl -X POST http://localhost:3001/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Standing Desk",
    "categoryId": 1,
    "price": 3500000,
    "stock": 10,
    "description": "Meja berdiri dengan tinggi yang bisa disesuaikan"
  }'
```

### Query Parameters

Untuk semua endpoint list (`GET /categories`, `GET /products`):

| Parameter    | Tipe   | Default | Deskripsi                                                |
| ------------ | ------ | ------- | -------------------------------------------------------- |
| `page`       | number | 1       | Nomor halaman untuk pagination                           |
| `limit`      | number | 10      | Jumlah item per halaman                                  |
| `search`     | string | —       | Kata kunci pencarian (filter berdasarkan nama)           |
| `categoryId` | number | —       | Filter products berdasarkan category (hanya di products) |

**Contoh:**

```bash
# Ambil halaman 2 dari products, 5 per halaman, filter category 1
curl "http://localhost:3001/api/v1/products?page=2&limit=5&categoryId=1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Format Response

Semua response API mengikuti struktur yang konsisten:

**Response Sukses:**

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "items": [ ... ],
    "meta": {
      "totalItems": 13,
      "page": 1,
      "totalPages": 2,
      "limit": 10
    }
  }
}
```

**Response Error:**

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "BAD_REQUEST",
  "details": [{ "field": "name", "message": "Nama wajib diisi" }],
  "timestamp": "2026-02-10T12:00:00.000Z"
}
```

---

## Arsitektur

### Backend (Pola MVC)

Backend mengikuti pola **MVC (Model-View-Controller)** yang diadaptasi untuk NestJS:

```
backend/src/modules/{module}/
├── controllers/    → Controller  : Menangani request HTTP, delegasi ke services
├── services/       → Service     : Berisi business logic, query database
├── models/         → Model       : Model Sequelize (definisi tabel, relasi)
├── dto/            → DTO         : Data Transfer Objects untuk validasi input
```

- **Model** — Mendefinisikan struktur tabel database menggunakan decorator Sequelize (`@Table`, `@Column`, `@HasMany`, `@BelongsTo`). Setiap model dipetakan langsung ke tabel MySQL.
- **Controller** — Entry point untuk request HTTP. Controller mem-parse request, memanggil method service yang sesuai, dan mengembalikan response. Controller tidak mengandung business logic.
- **Service** — Semua business logic ada di sini. Service berinteraksi dengan model untuk query database, menerapkan aturan bisnis (contoh: "tidak bisa hapus category yang masih punya products"), dan transformasi data.
- **DTO** — Memvalidasi data request menggunakan decorator `class-validator`. Request yang tidak valid akan ditolak sebelum mencapai controller.
- **View** — Dalam arsitektur fullstack ini, "View" adalah frontend React yang mengkonsumsi REST API.

### Arsitektur Frontend

```
frontend/src/
├── pages/          → Komponen level halaman (satu per route)
├── components/     → Komponen UI yang reusable
├── services/       → Layer service API (panggilan HTTP Axios)
├── store/          → Zustand store (state auth global)
├── types/          → Interface & tipe TypeScript
└── utils/          → Fungsi helper (parsing error, dll.)
```

Pola-pola utama yang digunakan:

- **Zustand** untuk global state yang ringan (token autentikasi, info user)
- **React Hook Form + Zod** untuk validasi form yang type-safe
- **Axios interceptors** untuk injeksi token otomatis dan penanganan 401
- **React Error Boundary** sebagai penanganan crash terakhir
- **Abstraksi layer service** — komponen tidak pernah memanggil Axios secara langsung

### Desain Database

Aplikasi menggunakan tiga tabel dengan relasi berikut:

```
┌──────────────────────┐         ┌──────────────────────────┐
│     categories       │         │        products           │
├──────────────────────┤         ├──────────────────────────┤
│ id          INT (PK) │────┐    │ id            INT (PK)   │
│ name        VARCHAR  │    │    │ category_id   INT (FK)   │◄──┐
│ description TEXT     │    │    │ name          VARCHAR    │   │
│ is_active   BOOLEAN  │    │    │ description   TEXT       │   │
│ created_at  DATETIME │    │    │ price         DECIMAL    │   │
│ updated_at  DATETIME │    │    │ stock         INT        │   │
└──────────────────────┘    │    │ is_active     BOOLEAN    │   │
                            │    │ created_at    DATETIME   │   │
                            │    │ updated_at    DATETIME   │   │
                            │    └──────────────────────────┘   │
                            │                                    │
                            └──────── One to Many ───────────────┘

┌──────────────────────┐
│       users          │
├──────────────────────┤
│ id          INT (PK) │
│ email       VARCHAR  │  (unique)
│ password    VARCHAR  │  (bcrypt hashed)
│ name        VARCHAR  │
│ role        VARCHAR  │  (default: 'admin')
│ is_active   BOOLEAN  │
│ created_at  DATETIME │
│ updated_at  DATETIME │
└──────────────────────┘
```

**Relasi:**

- `categories` → `products` : **One-to-Many** (1 category memiliki banyak products, 1 product hanya milik 1 category)
- Foreign key: `products.category_id` mereferensi `categories.id`

---

## Penanganan Error

Aplikasi menerapkan penanganan error berlapis di kedua sisi:

### Layer Error Backend

| Layer                       | Fungsi                                                                                          |
| --------------------------- | ----------------------------------------------------------------------------------------------- |
| **Global Exception Filter** | Menangkap semua exception yang tidak tertangani dan memformatnya menjadi response JSON standar  |
| **ValidationPipe**          | Validasi otomatis DTO yang masuk menggunakan decorator `class-validator`                        |
| **Service Layer**           | Melempar exception spesifik (`NotFoundException`, `ConflictException`, `UnauthorizedException`) |
| **Database Error Handler**  | Menangkap error spesifik Sequelize (unique constraint, foreign key, koneksi)                    |

### Layer Error Frontend

| Layer                   | Fungsi                                                                           |
| ----------------------- | -------------------------------------------------------------------------------- |
| **Error Boundary**      | Komponen React yang menangkap crash render dan menampilkan fallback UI           |
| **Axios Interceptor**   | Otomatis redirect ke halaman login saat menerima response 401 (Unauthorized)     |
| **`getErrorMessage()`** | Fungsi utilitas yang mengekstrak pesan error yang mudah dibaca dari response API |
| **Toast Notifications** | Memberikan feedback visual langsung untuk setiap aksi user                       |
| **Form Validation**     | Validasi client-side menggunakan schema Zod mencegah submission yang tidak valid |

---

## Dependencies

### Dependencies Backend

| Package                | Kegunaan                                         |
| ---------------------- | ------------------------------------------------ |
| `@nestjs/core`         | Framework utama NestJS                           |
| `@nestjs/config`       | Manajemen environment variable via file `.env`   |
| `@nestjs/jwt`          | Generate dan verifikasi token JWT                |
| `@nestjs/passport`     | Integrasi Passport.js untuk strategi autentikasi |
| `@nestjs/sequelize`    | Integrasi Sequelize ORM dengan NestJS            |
| `@nestjs/swagger`      | Dokumentasi Swagger/OpenAPI otomatis             |
| `sequelize`            | SQL ORM untuk query MySQL                        |
| `sequelize-typescript` | Decorator TypeScript untuk model Sequelize       |
| `mysql2`               | Driver database MySQL                            |
| `bcrypt`               | Hashing password yang aman                       |
| `class-validator`      | Decorator validasi DTO                           |
| `class-transformer`    | Transformasi tipe otomatis untuk DTO             |
| `passport-jwt`         | Strategi ekstraksi dan verifikasi JWT            |

### Dependencies Frontend

| Package               | Kegunaan                                                 |
| --------------------- | -------------------------------------------------------- |
| `react` (v19)         | Library UI                                               |
| `react-router-dom`    | Routing dan navigasi client-side                         |
| `axios`               | HTTP client untuk komunikasi API                         |
| `zustand`             | State management global yang ringan                      |
| `react-hook-form`     | Penanganan form yang performant dengan re-render minimal |
| `zod`                 | Validasi schema TypeScript-first                         |
| `@hookform/resolvers` | Menghubungkan schema Zod ke React Hook Form              |
| `tailwindcss` (v4)    | CSS framework utility-first                              |
| `lucide-react`        | Library ikon modern (berbasis Feather)                   |
| `react-hot-toast`     | Notifikasi toast yang ringan                             |

---

## Environment Variables

Buat file `.env` di direktori `backend/`:

| Variable         | Wajib | Default       | Deskripsi                                   |
| ---------------- | ----- | ------------- | ------------------------------------------- |
| `DB_HOST`        | Ya    | `localhost`   | Hostname server MySQL                       |
| `DB_PORT`        | Ya    | `3306`        | Port server MySQL                           |
| `DB_USERNAME`    | Ya    | `root`        | Username MySQL                              |
| `DB_PASSWORD`    | Ya    | —             | Password MySQL                              |
| `DB_NAME`        | Ya    | `admin_panel` | Nama database MySQL                         |
| `JWT_SECRET`     | Ya    | —             | Secret key untuk signing token JWT          |
| `JWT_EXPIRES_IN` | Tidak | `24h`         | Waktu kadaluarsa token (contoh: `1h`, `7d`) |
| `PORT`           | Tidak | `3001`        | Port server backend                         |

---

## Script yang Tersedia

### Backend (`cd backend`)

| Command              | Deskripsi                                         |
| -------------------- | ------------------------------------------------- |
| `npm run start:dev`  | Jalankan dalam mode development dengan hot-reload |
| `npm run start`      | Jalankan dalam mode standar                       |
| `npm run start:prod` | Jalankan dari folder `dist/` yang sudah dicompile |
| `npm run build`      | Compile TypeScript ke JavaScript                  |
| `npm run lint`       | Jalankan ESLint dengan auto-fix                   |
| `npm run test`       | Jalankan unit test dengan Jest                    |
| `npm run test:e2e`   | Jalankan end-to-end tests                         |
| `npm run test:cov`   | Jalankan test dengan laporan coverage             |
| `npm run format`     | Format kode dengan Prettier                       |

### Frontend (`cd frontend`)

| Command           | Deskripsi                                   |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | Jalankan Vite development server dengan HMR |
| `npm run build`   | Type-check dan build untuk production       |
| `npm run preview` | Preview build production secara lokal       |
| `npm run lint`    | Jalankan ESLint                             |

---

## Catatan Deployment

Berikut beberapa hal penting yang perlu diperhatikan saat deploy ke production:

1. **Matikan auto-sync database.** Di `backend/src/config/database.config.ts`, ubah `synchronize: true` menjadi `false`. Gunakan migration Sequelize yang proper daripada auto-sync di production untuk mencegah kehilangan data.

2. **Gunakan JWT secret yang kuat.** Generate string acak yang aman (minimal 32 karakter) untuk `JWT_SECRET`. Kamu bisa generate dengan:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Build frontend.** Jalankan `npm run build` di direktori `frontend/` dan serve folder `dist/` yang dihasilkan dengan static file server (Nginx, Caddy, dll.).

4. **Build backend.** Jalankan `npm run build` di direktori `backend/`, lalu start dengan `npm run start:prod`.

5. **Konfigurasi CORS.** Update array `origin` di `backend/src/main.ts` untuk menyertakan URL frontend production kamu daripada `localhost`.

6. **Environment variables.** Gunakan manajemen environment variable dari platform hosting kamu (bukan file `.env`) di production.

7. **Database seeder.** Seeder awal hanya berjalan ketika tabel kosong, jadi tidak akan menduplikasi data saat restart. Namun, kamu harus mengganti password admin default setelah login pertama.

---

## Troubleshooting

### Backend tidak mau start

- **"Access denied for user 'root'"** — Periksa `DB_USERNAME` dan `DB_PASSWORD` di file `.env`. Pastikan MySQL berjalan dan kredensial sudah benar.
- **"Unknown database 'admin_panel'"** — Kamu lupa membuat database. Jalankan `CREATE DATABASE admin_panel;` di MySQL client.
- **Port sudah digunakan** — Proses lain sedang menggunakan port 3001. Hentikan proses tersebut atau ubah `PORT` di file `.env`.

### Frontend tidak bisa terhubung ke API

- Pastikan backend berjalan di `http://localhost:3001`.
- Periksa bahwa CORS sudah diaktifkan untuk `http://localhost:5173` di `backend/src/main.ts`.
- Jika kamu mengubah port backend, update base URL di `frontend/src/services/api.ts`.

### Login tidak berfungsi

- Jalankan backend minimal sekali untuk membiarkan seeder membuat akun admin default.
- Pastikan kamu menggunakan kredensial yang tepat: `admin@example.com` / `password123`.
- Jika kamu sudah menjalankan backend sebelumnya dan mengubah data, seeder tidak akan membuat ulang admin (hanya seed ketika tabel kosong).

### "Tidak bisa menghapus category"

Ini adalah perilaku yang diharapkan. Category tidak bisa dihapus jika masih memiliki products yang terkait. Hapus atau pindahkan semua products di category tersebut terlebih dahulu, lalu coba lagi.

---

## Kontribusi

1. Fork repository
2. Buat branch fitur kamu (`git checkout -b feature/fitur-keren`)
3. Commit perubahan kamu (`git commit -m 'Tambah fitur keren'`)
4. Push ke branch (`git push origin feature/fitur-keren`)
5. Buka Pull Request

Pastikan kode kamu mengikuti style yang sudah ada dan lolos linting sebelum submit.

---

## Lisensi

Projek ini tidak berlisensi dan ditujukan untuk keperluan edukasi/challenge.

---

<div align="center">

**Dibangun dengan** NestJS + React + TypeScript

</div>
