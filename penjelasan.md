# PENJELASAN FITUR - Admin Panel Product Management System

> Dokumen panduan untuk demo video aplikasi

---

## DAFTAR ISI

1. [Login - Autentikasi JWT](#1-login---autentikasi-jwt)
2. [CRUD 2 Tabel dengan Relasi](#2-crud-2-tabel-dengan-relasi)
3. [Halaman List & Detail](#3-halaman-list--detail)
4. [Pencarian & Filter Data](#4-pencarian--filter-data)
5. [Pagination di Semua List](#5-pagination-di-semua-list)
6. [Implementasi Pattern MVC](#6-implementasi-pattern-mvc)
7. [Error Handling Lengkap](#7-error-handling-lengkap)

---

## 1. Login - Autentikasi JWT

### Fitur Login

Aplikasi menggunakan autentikasi JWT (JSON Web Token). User harus login dulu sebelum bisa mengakses halaman admin.

### Alur Login

**Frontend:**

1. User membuka halaman `/login` - file: `LoginPage.tsx`
2. Mengisi email dan password
3. Form divalidasi client-side menggunakan Zod
4. Data dikirim ke API melalui `authStore.ts` dan `auth.service.ts`

**Backend:** 5. Request ditangani oleh `auth.controller.ts` endpoint `/auth/login` 6. `auth.service.ts` mencari user berdasarkan email 7. Password dibandingkan menggunakan bcrypt 8. Jika cocok, generate JWT token dan kirim ke frontend 9. Jika tidak cocok, kirim error 401

**Setelah Login:** 10. Token disimpan di localStorage 11. User di-redirect ke Dashboard 12. Setiap request API otomatis menyertakan token di header (oleh `api.ts`)

### Proteksi Halaman

**Frontend:**

- Semua route dibungkus dengan `ProtectedRoute.tsx`
- Cek apakah ada token, jika tidak redirect ke `/login`

**Backend:**

- Semua endpoint (kecuali login/register) menggunakan `JwtAuthGuard`
- Token divalidasi oleh `jwt.strategy.ts`
- Jika token invalid/expired, kirim error 401
- Error 401 otomatis logout user (handled oleh axios interceptor di `api.ts`)

### File yang Terlibat

**Frontend Login:**

- `LoginPage.tsx` - halaman form login
- `authStore.ts` - state management token dan user
- `auth.service.ts` - service untuk call API login
- `ProtectedRoute.tsx` - proteksi route yang butuh login
- `api.ts` - axios interceptor untuk attach token

**Backend Login:**

- `auth.controller.ts` - endpoint /auth/login
- `auth.service.ts` - logic validasi email/password dan generate token
- `jwt.strategy.ts` - validasi JWT token
- `jwt-auth.guard.ts` - guard untuk proteksi endpoint

---

## 2. CRUD 2 Tabel dengan Relasi

### Relasi One to Many

Aplikasi mengelola 2 tabel dengan relasi:

- **Categories** (1) → **Products** (Many)
- 1 kategori bisa punya banyak produk
- 1 produk hanya punya 1 kategori
- Foreign key: kolom `category_id` di tabel products

### Implementasi Relasi di Backend

**Model Category** (`category.model.ts`):

- Menggunakan decorator `@HasMany(() => Product)`
- Artinya 1 category punya banyak products

**Model Product** (`product.model.ts`):

- Menggunakan decorator `@ForeignKey(() => Category)` di kolom categoryId
- Menggunakan decorator `@BelongsTo(() => Category)`
- Artinya product milik 1 category

### Penggunaan Relasi dalam Query

**Saat ambil list products:**

- Otomatis include data category (id dan nama saja)
- Query di `products.service.ts` dengan include Category

**Saat ambil detail category:**

- Otomatis include semua products milik category tersebut
- Query di `categories.service.ts` dengan include Product

**Saat ambil list categories:**

- Hitung jumlah products per category menggunakan subquery
- Ditampilkan di kolom "Jumlah Products"

### CRUD Operations

**Categories:**

- Create: tambah kategori baru
- Read: list semua kategori dengan pagination & search
- Read: detail kategori + list products-nya
- Update: edit nama/deskripsi kategori
- Delete: hapus kategori (hanya jika tidak punya products)

**Products:**

- Create: tambah produk baru (pilih kategori dari dropdown)
- Read: list semua produk dengan pagination, search & filter kategori
- Read: detail produk + info kategorinya
- Update: edit produk (bisa ganti kategori)
- Delete: hapus produk

### File yang Terlibat

**Backend Models:**

- `category.model.ts` - definisi tabel categories dengan relasi HasMany
- `product.model.ts` - definisi tabel products dengan relasi BelongsTo

**Backend Services:**

- `categories.service.ts` - logic CRUD categories + relasi ke products
- `products.service.ts` - logic CRUD products + relasi ke category

**Backend Controllers:**

- `categories.controller.ts` - endpoint API untuk categories
- `products.controller.ts` - endpoint API untuk products

---

## 3. Halaman List & Detail

### Struktur Halaman

Setiap tabel punya 2 jenis halaman:

- **List Page** - tabel data dengan pagination, search, CRUD
- **Detail Page** - info lengkap 1 record

### Halaman Categories

**List Page** (URL: `/categories`):

- File: `CategoriesPage.tsx`
- Fitur: tabel categories dengan search, pagination
- Tombol aksi: Detail (eye), Edit (pencil), Hapus (trash)
- Modal untuk tambah/edit category
- Modal konfirmasi hapus

**Detail Page** (URL: `/categories/:id`):

- File: `CategoryDetailPage.tsx`
- Menampilkan info lengkap category
- Tabel products yang ada di category ini
- Bisa search dan pagination untuk products
- Link ke detail setiap product
- Tombol kembali ke list

### Halaman Products

**List Page** (URL: `/products`):

- File: `ProductsPage.tsx`
- Fitur: tabel products dengan search, filter category, pagination
- Tombol aksi: Detail (eye), Edit (pencil), Hapus (trash)
- Modal untuk tambah/edit product (dengan dropdown pilih category)
- Modal konfirmasi hapus

**Detail Page** (URL: `/products/:id`):

- File: `ProductDetailPage.tsx`
- Menampilkan info lengkap product (nama, harga, stock, deskripsi)
- Badge category (klik untuk ke detail category)
- Link "Lihat semua product di category ini"
- Tombol kembali ke list

### Alur Navigasi

**List ke Detail:**

1. User klik icon mata (eye) di baris data
2. Navigate ke URL detail dengan ID
3. Halaman detail call API untuk get data
4. Tampilkan informasi lengkap

**Detail Category ke Products:**

1. Di detail category, otomatis load products milik category tersebut
2. User bisa klik product untuk ke detail product
3. User bisa klik "Lihat semua product" untuk ke list products filtered

### API Endpoints yang Digunakan

**Categories:**

- List: `GET /api/v1/categories?page=1&limit=10&search=...`
- Detail: `GET /api/v1/categories/:id`
- Create: `POST /api/v1/categories`
- Update: `PUT /api/v1/categories/:id`
- Delete: `DELETE /api/v1/categories/:id`

**Products:**

- List: `GET /api/v1/products?page=1&limit=10&search=...&categoryId=...`
- Detail: `GET /api/v1/products/:id`
- Create: `POST /api/v1/products`
- Update: `PUT /api/v1/products/:id`
- Delete: `DELETE /api/v1/products/:id`

### File yang Terlibat

**Frontend Pages:**

- `CategoriesPage.tsx` - list dan CRUD categories
- `CategoryDetailPage.tsx` - detail category dan products-nya
- `ProductsPage.tsx` - list dan CRUD products
- `ProductDetailPage.tsx` - detail product

**Frontend Services:**

- `categories.service.ts` - call API categories
- `products.service.ts` - call API products

**Komponen:**

- `Pagination.tsx` - komponen pagination
- `DeleteModal.tsx` - modal konfirmasi hapus

---

## 4. Pencarian & Filter Data

### Fitur Search

Tersedia di semua halaman list (categories dan products). User mengetik keyword, data otomatis difilter tanpa perlu klik tombol.

### Cara Kerja Pencarian

**Frontend:**

1. User ketik keyword di search bar (contoh: "laptop")
2. State search berubah, trigger useEffect
3. Page otomatis reset ke halaman 1
4. Call API dengan parameter search

**Backend:** 5. Controller terima parameter search dari query 6. Service bangun WHERE clause menggunakan LIKE query 7. Database cari data yang nama-nya mengandung keyword 8. Return hasil pencarian dengan pagination

### Pencarian di Categories

**Frontend:** `CategoriesPage.tsx`

- Input search untuk cari berdasarkan nama

**Backend:** `categories.service.ts`

- Query menggunakan operator LIKE
- Cari di kolom nama category

### Pencarian di Products (+ Filter Category)

**Frontend:** `ProductsPage.tsx`

- Input search untuk cari berdasarkan nama
- Dropdown filter untuk pilih category

**Backend:** `products.service.ts`

- Query menggunakan operator LIKE untuk search nama
- Query menggunakan WHERE untuk filter categoryId
- Bisa kombinasi search + filter sekaligus

### Contoh Kombinasi Filter

- Search saja: cari products yang nama-nya mengandung "laptop"
- Filter saja: cari products yang category-nya "Electronics" (categoryId=1)
- Kombinasi: cari products yang nama-nya "laptop" DAN category-nya "Electronics"

### File yang Terlibat

**Frontend:**

- `CategoriesPage.tsx` - search input untuk categories
- `ProductsPage.tsx` - search input + dropdown filter category

**Backend:**

- `categories.service.ts` - logic pencarian categories
- `products.service.ts` - logic pencarian + filter products
- `query-category.dto.ts` - validasi parameter search untuk categories
- `query-product.dto.ts` - validasi parameter search dan categoryId untuk products

---

## 5. Pagination di Semua List

### Konsep Pagination

Semua endpoint yang return list data menggunakan format paginated response. Bukan hanya return array, tapi sudah include metadata pagination (page, limit, total).

### Format Response

Response API untuk list selalu punya struktur:

- `items` - array data untuk halaman ini saja
- `meta` - informasi pagination (page saat ini, limit per page, total items, total pages)

### Implementasi Backend

**Categories dan Products:**

- File: `categories.service.ts` dan `products.service.ts`
- Terima parameter: page (default 1) dan limit (default 10)
- Hitung offset dari page dan limit
- Query database dengan findAndCountAll (ambil data + hitung total)
- Return format: items (data halaman ini) + meta (info pagination)

**Cara Hitung:**

- Offset = (page - 1) × limit
- Total pages = total items ÷ limit (dibulatkan ke atas)

### Implementasi Frontend

**Tipe Data:**

- File: `api.types.ts`
- Interface untuk PaginationMeta dan PaginatedResponse

**Komponen Pagination:**

- File: `Pagination.tsx`
- Tampilkan tombol halaman 1, 2, 3, ...
- Tombol Previous dan Next
- Disable tombol kalau sudah di halaman pertama/terakhir
- Call callback saat user klik nomor halaman

**Penggunaan di Halaman:**

- File: `CategoriesPage.tsx` dan `ProductsPage.tsx`
- State untuk page dan meta
- Pass ke komponen Pagination
- Saat user klik page, update state dan fetch data baru

### Query Parameters

Parameter yang diterima backend:

- `page` - halaman yang diminta (default: 1)
- `limit` - jumlah data per halaman (default: 10)
- `search` - keyword pencarian (optional)
- `categoryId` - filter category untuk products (optional)

### File yang Terlibat

**Backend:**

- `categories.service.ts` - pagination logic untuk categories
- `products.service.ts` - pagination logic untuk products
- `query-category.dto.ts` - validasi query params categories
- `query-product.dto.ts` - validasi query params products
- `transform.interceptor.ts` - wrapper semua response jadi format standar

**Frontend:**

- `api.types.ts` - interface PaginationMeta dan PaginatedResponse
- `Pagination.tsx` - komponen UI pagination
- `CategoriesPage.tsx` - pakai pagination untuk categories
- `ProductsPage.tsx` - pakai pagination untuk products

---

## 6. Implementasi Pattern MVC

### Konsep MVC

MVC (Model - View - Controller) adalah pattern yang memisahkan kode berdasarkan tanggung jawab:

| Layer      | Tanggung Jawab                        | Implementasi                            |
| ---------- | ------------------------------------- | --------------------------------------- |
| Model      | Representasi data & struktur database | File `*.model.ts` (Sequelize ORM)       |
| View       | Tampilan UI                           | Semua React components & pages          |
| Controller | Terima request, return response       | File `*.controller.ts` + `*.service.ts` |

### Struktur Folder per Module

Setiap module (categories, products, auth, users) punya struktur sama:

- `controllers/` - terima HTTP request, delegasi ke service
- `services/` - business logic
- `models/` - definisi tabel database
- `dto/` - validasi input dan query parameters

### Layer MODEL

**Lokasi:** `backend/src/modules/*/models/`

**Fungsi:**

- Definisi struktur tabel menggunakan Sequelize decorators
- Definisi relasi antar tabel (HasMany, BelongsTo, ForeignKey)
- TIDAK berisi business logic

**File yang Ada:**

- `category.model.ts` - tabel categories dengan relasi HasMany ke products
- `product.model.ts` - tabel products dengan relasi BelongsTo ke category
- `user.model.ts` - tabel users untuk autentikasi

### Layer VIEW

**Lokasi:** `frontend/src/`

**Fungsi:**

- Menampilkan data dari API
- Handle user interaction
- Tidak langsung akses database, semua via API

**File yang Ada:**

- `pages/` - halaman utama (LoginPage, DashboardPage, CategoriesPage, ProductsPage, dan detail pages)
- `components/` - komponen reusable (ProtectedRoute, Pagination, DeleteModal, Header, Sidebar)

### Layer CONTROLLER

**Lokasi:** `backend/src/modules/*/controllers/`

**Fungsi:**

- Terima HTTP request (GET, POST, PUT, DELETE)
- Validasi input via DTO
- Delegasi logic ke Service layer
- Return response ke client

**File yang Ada:**

- `categories.controller.ts` - endpoint CRUD categories
- `products.controller.ts` - endpoint CRUD products
- `auth.controller.ts` - endpoint login, register, profile

### Layer SERVICE

**Lokasi:** `backend/src/modules/*/services/`

**Fungsi:**

- Berisi SEMUA business logic
- Interaksi dengan Model untuk query database
- Validasi logic bisnis (contoh: cek apakah category punya products sebelum hapus)
- Throw exception kalau ada error (NotFoundException, ConflictException, dll)

**File yang Ada:**

- `categories.service.ts` - logic CRUD categories + relasi
- `products.service.ts` - logic CRUD products + relasi
- `auth.service.ts` - logic login (validasi password, generate JWT)

### Alur Request MVC (Contoh: Create Product)

**1. VIEW (Frontend):**

- User isi form di `ProductsPage.tsx`
- Klik tombol Simpan
- Call `productsService.create(data)` → kirim POST request

**2. CONTROLLER (Backend):**

- Request diterima di `products.controller.ts` endpoint POST /products
- Validasi otomatis via `CreateProductDto` (ValidationPipe)
- Call `productsService.create(dto)`

**3. SERVICE (Backend):**

- `products.service.ts` method create()
- Interaksi dengan Model untuk insert data
- Ambil kembali data lengkap dengan relasi category

**4. MODEL (Backend):**

- `product.model.ts` - Sequelize execute INSERT
- Sequelize execute SELECT join dengan categories

**5. Response kembali ke VIEW:**

- Service return data ke Controller
- Controller return response ke Frontend
- Frontend tampilkan toast success dan refresh tabel

### File yang Terlibat

**Model Layer:**

- `category.model.ts`
- `product.model.ts`
- `user.model.ts`

**View Layer:**

- `LoginPage.tsx`
- `DashboardPage.tsx`
- `CategoriesPage.tsx`
- `CategoryDetailPage.tsx`
- `ProductsPage.tsx`
- `ProductDetailPage.tsx`

**Controller Layer:**

- `auth.controller.ts`
- `categories.controller.ts`
- `products.controller.ts`

**Service Layer:**

- `auth.service.ts`
- `categories.service.ts`
- `products.service.ts`

**DTO (Validasi):**

- `login.dto.ts`, `register.dto.ts`
- `create-category.dto.ts`, `update-category.dto.ts`, `query-category.dto.ts`
- `create-product.dto.ts`, `update-product.dto.ts`, `query-product.dto.ts`

---

## 7. Error Handling Lengkap

### Overview

Error handling di aplikasi ini ada di 6 layer berbeda:

- **3 layer di Backend** (validasi input, logic bisnis, global exception filter)
- **3 layer di Frontend** (axios interceptor, error utility, error boundary)

---

### BACKEND ERROR HANDLING

#### Layer 1: ValidationPipe + DTO

**File:** `main.ts` (setup global pipe)

**Fungsi:**

- Validasi otomatis semua input sebelum masuk controller
- Menggunakan class-validator decorators di DTO
- Jika input invalid, langsung return error 400 sebelum logic dijalankan

**DTO yang Divalidasi:**

- `login.dto.ts` - validasi email dan password format
- `register.dto.ts` - validasi email unique, password strength
- `create-product.dto.ts` - validasi nama, harga, stock, categoryId
- `create-category.dto.ts` - validasi nama dan deskripsi
- `query-*.dto.ts` - validasi query parameters (page, limit, search)

**Error yang Ditangkap:**

- Field required tapi kosong
- Tipe data salah (string vs number)
- Format email invalid
- Nilai di bawah minimum
- Field yang tidak dikenal

#### Layer 2: Service Layer Exceptions

**File:** `*.service.ts` (categories, products, auth)

**Fungsi:**

- Handle error terkait business logic
- Throw exception sesuai kondisi

**Exception yang Dipakai:**

| Exception             | Status | Kapan Dipakai                                            | File                             |
| --------------------- | ------ | -------------------------------------------------------- | -------------------------------- |
| NotFoundException     | 404    | Data tidak ditemukan saat findOne/update/delete          | categories/products service      |
| UnauthorizedException | 401    | Email/password salah, token invalid/expired              | auth.service, jwt.strategy       |
| ConflictException     | 409    | Email duplikat, hapus category yang masih punya products | auth.service, categories.service |

**Contoh Kasus:**

- Cari product by ID yang tidak ada → throw NotFoundException
- Login dengan password salah → throw UnauthorizedException
- Hapus category yang masih punya products → throw ConflictException (ada message spesifik berapa products)
- Register dengan email yang sudah ada → throw ConflictException

#### Layer 3: Global Exception Filter

**File:** `http-exception.filter.ts`

**Fungsi:**

- Tangkap SEMUA error dari seluruh aplikasi
- Format jadi response JSON yang konsisten
- Handle error yang tidak terduga

**Jenis Error yang Ditangkap:**

1. **HttpException** (BadRequest, NotFound, Unauthorized, Conflict)
   - Ambil status code dan message dari exception
   - Format response standar

2. **Database Errors** (Sequelize)
   - UniqueConstraintError → 409 "Data duplikat"
   - ForeignKeyConstraintError → 409 "Tidak bisa hapus, data terhubung"
   - ValidationError → 400 "Validasi database gagal"
   - ConnectionError → 503 "Koneksi database gagal"
   - DatabaseError → 500 "Error database"

3. **Generic JavaScript Error**
   - Ambil error message
   - Return 500 Internal Server Error

**Output:**

- Selalu return format: statusCode, message, error, details, timestamp

---

### FRONTEND ERROR HANDLING

#### Layer 4: Axios Interceptor

**File:** `api.ts`

**Fungsi:**

- Intercept semua response dari API
- Jika status 401 (Unauthorized), otomatis logout dan redirect ke /login
- User tidak perlu manual logout saat token expired

**Kapan Terjadi:**

- Token JWT expired
- Token invalid
- User dihapus dari database

#### Layer 5: Error Utility + Toast Notification

**File:** `error.ts` dan semua pages (CategoriesPage, ProductsPage, LoginPage)

**Fungsi:**

- Extract error message dari response API
- Tampilkan ke user via toast notification (merah untuk error, hijau untuk success)

**Cara Kerja:**

- Setiap aksi CRUD dibungkus try-catch
- Jika error, call `getErrorMessage(error)` untuk extract pesan
- Tampilkan toast dengan pesan tersebut

**Diterapkan di:**

- Login (email/password salah)
- Create category/product
- Update category/product
- Delete category/product

#### Layer 6: React Error Boundary

**File:** `ErrorBoundary.tsx`

**Fungsi:**

- Tangkap error JavaScript yang tidak tertangkap di komponen React
- Cegah aplikasi crash (layar putih)
- Tampilkan halaman error yang user-friendly

**Cara Kerja:**

- Wrap seluruh aplikasi di `App.tsx`
- Jika ada render error atau exception, tampilkan fallback UI
- Ada tombol "Kembali ke Dashboard" untuk recovery

#### Bonus: Validasi Form Client-Side

**File:** Semua pages dengan form

**Fungsi:**

- Validasi input di client sebelum kirim ke API
- Menggunakan Zod schema + React Hook Form
- Mencegah request invalid, UX lebih baik

**Diterapkan di:**

- Form login
- Form create/edit category
- Form create/edit product

---

### Ringkasan 6 Layer Error Handling

**BACKEND:**

1. **ValidationPipe + DTO** → validasi input otomatis
2. **Service Exceptions** → error logic bisnis (NotFound, Unauthorized, Conflict)
3. **Global Exception Filter** → tangkap semua error, format response konsisten

**FRONTEND:** 4. **Axios Interceptor** → auto-redirect kalau 401 5. **Error Utility + Toast** → extract pesan error, tampilkan ke user 6. **Error Boundary** → tangkap crash React, tampilkan fallback UI

---

### File yang Terlibat

**Backend - Layer 1 (Validasi):**

- `main.ts` - setup ValidationPipe
- `login.dto.ts`, `register.dto.ts`
- `create-category.dto.ts`, `update-category.dto.ts`, `query-category.dto.ts`
- `create-product.dto.ts`, `update-product.dto.ts`, `query-product.dto.ts`

**Backend - Layer 2 (Service Exceptions):**

- `auth.service.ts` - UnauthorizedException untuk login
- `categories.service.ts` - NotFoundException, ConflictException
- `products.service.ts` - NotFoundException
- `jwt.strategy.ts` - UnauthorizedException untuk token invalid

**Backend - Layer 3 (Global Filter):**

- `http-exception.filter.ts` - tangkap semua error, format response

**Frontend - Layer 4 (Interceptor):**

- `api.ts` - axios interceptor untuk 401

**Frontend - Layer 5 (Error Utility):**

- `error.ts` - function getErrorMessage
- `CategoriesPage.tsx` - try-catch di CRUD actions
- `ProductsPage.tsx` - try-catch di CRUD actions
- `LoginPage.tsx` - try-catch di login action

**Frontend - Layer 6 (Error Boundary):**

- `ErrorBoundary.tsx` - catch React errors
- `App.tsx` - wrap ErrorBoundary

---

**Selesai!** 🎯
