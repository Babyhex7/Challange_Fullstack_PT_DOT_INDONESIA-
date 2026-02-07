# PENJELASAN TEKNIS — Admin Panel Product Management System

> Dokumen ini menjelaskan secara detail bagaimana setiap poin **Petunjuk Pengerjaan** diimplementasikan dalam source code, beserta alur teknis dan lokasi file-nya.

---

## DAFTAR ISI

1. [Admin Panel + Fitur Login](#1-admin-panel-yang-bisa-manajemen-data-dari-2-tabel-disertai-fitur-login)
2. [Relasi One to Many](#2-dua-tabel-tersebut-memiliki-relasi-one-to-many)
3. [Page List dan Detail](#3-page-untuk-menampilkan-data-2-tabel-baik-list-maupun-detail)
4. [Fitur Pencarian Data](#4-fitur-pencarian-data)
5. [Semua Respon Berbentuk Page](#5-semua-respon-berbentuk-page)
6. [Pattern MVC](#6-pattern-mvc)
7. [Implementasi Error Handling](#7-implementasi-error-handling)

---

## 1. Admin Panel yang Bisa Manajemen Data dari 2 Tabel Disertai Fitur Login

### Penjelasan

Aplikasi ini adalah admin panel fullstack (NestJS + React) yang mengelola **2 tabel utama**: `categories` dan `products`. Semua halaman admin hanya bisa diakses setelah **login** menggunakan autentikasi **JWT (JSON Web Token)**.

### Alur Login (End-to-End)

```
User buka /login
    │
    ▼
[Frontend] LoginPage.tsx
  → User isi email + password
  → Form divalidasi oleh Zod (client-side)
  → Panggil authStore.login()
    │
    ▼
[Frontend] authStore.ts
  → Panggil authService.login({ email, password })
    │
    ▼
[Frontend] auth.service.ts
  → POST /api/v1/auth/login (via Axios)
    │
    ▼
[Backend] auth.controller.ts
  → @Post('login') → panggil authService.login(dto)
    │
    ▼
[Backend] auth.service.ts
  → Cari user by email (usersService.findByEmail)
  → Bandingkan password dengan bcrypt.compare()
  → Kalau cocok → generate JWT token (jwtService.sign)
  → Return { accessToken, user }
    │
    ▼
[Frontend] authStore.ts
  → Simpan token ke localStorage
  → Panggil authService.getProfile() → simpan user ke state
  → Redirect ke Dashboard (/)
```

### Proteksi Halaman Admin

```
User akses halaman yang butuh login (/, /categories, /products, dll)
    │
    ▼
[Frontend] App.tsx → route dibungkus <ProtectedRoute>
    │
    ▼
[Frontend] ProtectedRoute.tsx
  → Cek: apakah ada token di authStore?
  → Kalau TIDAK ada → redirect ke /login
  → Kalau ADA → render halaman admin
```

### Proteksi API Backend

```
Setiap request ke endpoint (kecuali login/register)
    │
    ▼
[Backend] Controller pakai @UseGuards(JwtAuthGuard)
    │
    ▼
[Backend] jwt-auth.guard.ts → extends AuthGuard('jwt')
    │
    ▼
[Backend] jwt.strategy.ts
  → Ambil token dari header Authorization: Bearer <token>
  → Verifikasi token dengan JWT_SECRET
  → Decode payload → cari user di database
  → Kalau valid → lanjut ke controller
  → Kalau tidak → throw UnauthorizedException (401)
```

### File Terkait

| File                 | Lokasi                                                    | Fungsi                                                     |
| -------------------- | --------------------------------------------------------- | ---------------------------------------------------------- |
| LoginPage.tsx        | `frontend/src/pages/LoginPage.tsx`                        | Halaman form login                                         |
| authStore.ts         | `frontend/src/store/authStore.ts`                         | State management login/logout/token (Zustand)              |
| auth.service.ts (FE) | `frontend/src/services/auth.service.ts`                   | Panggil API login/register/profile                         |
| ProtectedRoute.tsx   | `frontend/src/components/auth/ProtectedRoute.tsx`         | Cek token, redirect kalau belum login                      |
| auth.controller.ts   | `backend/src/modules/auth/controllers/auth.controller.ts` | Handle endpoint /auth/login, /auth/register, /auth/profile |
| auth.service.ts (BE) | `backend/src/modules/auth/services/auth.service.ts`       | Logic login (validasi password + generate JWT)             |
| jwt.strategy.ts      | `backend/src/modules/auth/strategies/jwt.strategy.ts`     | Validasi token JWT dari header                             |
| jwt-auth.guard.ts    | `backend/src/common/guards/jwt-auth.guard.ts`             | Guard untuk proteksi endpoint                              |
| api.ts               | `frontend/src/services/api.ts`                            | Axios instance, auto-attach token ke setiap request        |

---

## 2. Dua Tabel Tersebut Memiliki Relasi One to Many

### Penjelasan

Relasi yang digunakan: **Category → Products (One to Many)**

- 1 category **memiliki banyak** products
- 1 product **hanya milik** 1 category
- Foreign key ada di tabel `products` kolom `category_id` yang merujuk ke `categories.id`

### Implementasi di Model (Sequelize ORM)

**Category Model** — sisi "One" (induk):

```
File: backend/src/modules/categories/models/category.model.ts

@HasMany(() => Product)      ← dekorator yang menyatakan "1 category punya banyak products"
products: Product[];
```

**Product Model** — sisi "Many" (anak):

```
File: backend/src/modules/products/models/product.model.ts

@ForeignKey(() => Category)  ← dekorator yang menandai kolom ini sebagai foreign key
@Column({
  type: DataType.INTEGER,
  allowNull: false,
  field: 'category_id',     ← nama kolom di database
})
declare categoryId: number;

@BelongsTo(() => Category)   ← dekorator yang menyatakan "product milik 1 category"
category: Category;
```

### Cara Relasi Digunakan dalam Query

**Saat ambil list products** — otomatis include nama category:

```
File: backend/src/modules/products/services/products.service.ts → findAll()

include: [{
  model: Category,
  attributes: ['id', 'name'],   ← hanya ambil id dan nama category (efisien)
}]
```

**Saat ambil detail category** — otomatis include semua products:

```
File: backend/src/modules/categories/services/categories.service.ts → findOne()

include: [{ model: Product }]   ← semua products milik category ini ikut di-load
```

**Saat ambil list categories** — hitung jumlah products per category:

```
File: backend/src/modules/categories/services/categories.service.ts → findAll()

Sequelize.literal(
  '(SELECT COUNT(*) FROM products WHERE products.category_id = `Category`.`id`)'
)  ← subquery untuk hitung jumlah products
```

### Diagram Relasi

```
┌─────────────────┐         ┌─────────────────────┐
│   categories    │         │      products        │
├─────────────────┤         ├─────────────────────┤
│ id (PK)         │───┐     │ id (PK)             │
│ name            │   │     │ category_id (FK) ◄──┘
│ description     │   │     │ name                │
│ is_active       │   │     │ description         │
│ created_at      │   │     │ price               │
│ updated_at      │   │     │ stock               │
└─────────────────┘   │     │ is_active           │
                      │     │ created_at          │
   1 Category ────────┘     │ updated_at          │
   punya banyak Products    └─────────────────────┘
```

### File Terkait

| File              | Lokasi                                                    | Fungsi                                   |
| ----------------- | --------------------------------------------------------- | ---------------------------------------- |
| category.model.ts | `backend/src/modules/categories/models/category.model.ts` | Model Category + @HasMany                |
| product.model.ts  | `backend/src/modules/products/models/product.model.ts`    | Model Product + @BelongsTo + @ForeignKey |

---

## 3. Page untuk Menampilkan Data 2 Tabel, Baik List Maupun Detail

### Penjelasan

Setiap tabel punya **2 jenis halaman**:

1. **List Page** — menampilkan data dalam tabel dengan pagination, search, dan aksi CRUD
2. **Detail Page** — menampilkan informasi lengkap 1 record

### Halaman Categories

**List → CategoriesPage:**

```
URL: /categories
File: frontend/src/pages/CategoriesPage.tsx

Menampilkan:
- Tabel: nomor, nama, deskripsi, jumlah products, tombol aksi
- Search bar untuk cari berdasarkan nama
- Pagination di bawah tabel
- Tombol: Detail (eye icon), Edit (pencil icon), Hapus (trash icon)
- Modal form untuk tambah/edit category
- Modal konfirmasi untuk hapus category
```

**Detail → CategoryDetailPage:**

```
URL: /categories/:id
File: frontend/src/pages/CategoryDetailPage.tsx

Menampilkan:
- Info lengkap category: nama, deskripsi, status aktif, tanggal dibuat/diupdate
- Jumlah products di category ini
- Tabel products yang ada di category ini (dengan search + pagination)
- Link ke detail setiap product
- Tombol kembali ke list categories
```

### Halaman Products

**List → ProductsPage:**

```
URL: /products
File: frontend/src/pages/ProductsPage.tsx

Menampilkan:
- Tabel: nomor, nama, category, harga, deskripsi, tombol aksi
- Search bar untuk cari berdasarkan nama
- Dropdown filter berdasarkan category
- Pagination di bawah tabel
- Tombol: Detail (eye icon), Edit (pencil icon), Hapus (trash icon)
- Modal form untuk tambah/edit product (dropdown pilih category)
- Modal konfirmasi untuk hapus product
```

**Detail → ProductDetailPage:**

```
URL: /products/:id
File: frontend/src/pages/ProductDetailPage.tsx

Menampilkan:
- Info lengkap product: nama, deskripsi, status aktif, tanggal dibuat/diupdate
- Harga (format Rupiah)
- Stock
- Badge category (klik untuk ke detail category)
- Link "Lihat semua product di category ini"
- Tombol kembali ke list products
```

### Alur dari List ke Detail

```
User di halaman /categories
  → Klik icon mata (Eye) pada baris data
  → navigate('/categories/5')
  → CategoryDetailPage dimuat
  → Panggil categoriesService.getById(5)
  → Panggil productsService.getAll({ categoryId: 5 })
  → Tampilkan info category + tabel products-nya
```

### Routing (App.tsx)

```tsx
File: frontend/src/App.tsx

<Route path="/categories" element={<CategoriesPage />} />         ← list
<Route path="/categories/:id" element={<CategoryDetailPage />} /> ← detail
<Route path="/products" element={<ProductsPage />} />             ← list
<Route path="/products/:id" element={<ProductDetailPage />} />    ← detail
```

### API Endpoints yang Digunakan

| Halaman                     | API yang Dipanggil                                                   | Keterangan                   |
| --------------------------- | -------------------------------------------------------------------- | ---------------------------- |
| CategoriesPage (list)       | `GET /api/v1/categories?page=1&limit=10&search=...`                  | Paginated list               |
| CategoryDetailPage (detail) | `GET /api/v1/categories/:id` + `GET /api/v1/products?categoryId=:id` | Info category + products-nya |
| ProductsPage (list)         | `GET /api/v1/products?page=1&limit=10&search=...&categoryId=...`     | Paginated list + filter      |
| ProductDetailPage (detail)  | `GET /api/v1/products/:id`                                           | Info product + category-nya  |

### File Terkait

| File                   | Lokasi                                      | Fungsi                         |
| ---------------------- | ------------------------------------------- | ------------------------------ |
| CategoriesPage.tsx     | `frontend/src/pages/CategoriesPage.tsx`     | List + CRUD categories         |
| CategoryDetailPage.tsx | `frontend/src/pages/CategoryDetailPage.tsx` | Detail category + products-nya |
| ProductsPage.tsx       | `frontend/src/pages/ProductsPage.tsx`       | List + CRUD products           |
| ProductDetailPage.tsx  | `frontend/src/pages/ProductDetailPage.tsx`  | Detail product                 |
| DashboardPage.tsx      | `frontend/src/pages/DashboardPage.tsx`      | Overview statistik             |

---

## 4. Fitur Pencarian Data

### Penjelasan

Fitur pencarian tersedia di **semua halaman list** (categories dan products). User mengetik keyword, lalu data otomatis difilter tanpa perlu klik tombol search.

### Alur Pencarian (Contoh: Cari Product)

```
User ketik "macbook" di search bar
    │
    ▼
[Frontend] ProductsPage.tsx
  → State 'search' berubah → "macbook"
  → useEffect reset page ke 1 (agar mulai dari awal)
  → useEffect fetchData() dipanggil ulang
    │
    ▼
[Frontend] productsService.getAll({ page: 1, limit: 10, search: "macbook" })
  → GET /api/v1/products?page=1&limit=10&search=macbook
    │
    ▼
[Backend] products.controller.ts → findAll(@Query() query)
  → query.search = "macbook"
    │
    ▼
[Backend] products.service.ts → findAll(query)
  → Bangun WHERE clause:
    where.name = { [Op.like]: '%macbook%' }    ← pencarian partial match
  → findAndCountAll({ where, limit, offset, ... })
  → Return data yang nama-nya mengandung "macbook"
    │
    ▼
[Frontend] ProductsPage.tsx
  → setProducts(data.items)   ← update tabel
  → setMeta(data.meta)        ← update pagination info
```

### Pencarian di Categories

```
File: backend/src/modules/categories/services/categories.service.ts → findAll()

const where = search
  ? { name: { [Op.like]: `%${search}%` } }   ← LIKE query
  : {};
```

### Pencarian di Products (+ Filter Category)

```
File: backend/src/modules/products/services/products.service.ts → findAll()

if (search) {
  where.name = { [Op.like]: `%${search}%` };   ← pencarian by nama
}
if (categoryId) {
  where.categoryId = categoryId;                ← filter by category
}
```

Products punya **2 filter sekaligus**: search (teks) + filter category (dropdown). Keduanya bisa dikombinasikan.

### Contoh Query

| Input User                         | Query ke Database                                |
| ---------------------------------- | ------------------------------------------------ |
| search = "laptop"                  | `WHERE name LIKE '%laptop%'`                     |
| categoryId = 1                     | `WHERE category_id = 1`                          |
| search = "laptop" + categoryId = 1 | `WHERE name LIKE '%laptop%' AND category_id = 1` |

### File Terkait

| File                       | Lokasi                                                          | Fungsi                                           |
| -------------------------- | --------------------------------------------------------------- | ------------------------------------------------ |
| CategoriesPage.tsx         | `frontend/src/pages/CategoriesPage.tsx`                         | Search input categories                          |
| ProductsPage.tsx           | `frontend/src/pages/ProductsPage.tsx`                           | Search input + dropdown filter category products |
| categories.service.ts (BE) | `backend/src/modules/categories/services/categories.service.ts` | Logic pencarian categories (Op.like)             |
| products.service.ts (BE)   | `backend/src/modules/products/services/products.service.ts`     | Logic pencarian + filter products (Op.like)      |
| query-category.dto.ts      | `backend/src/modules/categories/dto/query-category.dto.ts`      | Validasi parameter search untuk categories       |
| query-product.dto.ts       | `backend/src/modules/products/dto/query-product.dto.ts`         | Validasi parameter search + categoryId           |

---

## 5. Semua Respon Berbentuk Page

### Penjelasan

Setiap endpoint yang mengembalikan **list data** menggunakan format **paginated response** (berisi data + informasi halaman). Ini bukan hanya mengembalikan array mentah, tapi sudah dibungkus dalam format standar yang mengandung metadata pagination.

### Format Response Paginated

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "items": [                    ← array data halaman ini
      { "id": 1, "name": "Electronics", ... },
      { "id": 2, "name": "Clothing", ... }
    ],
    "meta": {                     ← metadata pagination
      "page": 1,                  ← halaman saat ini
      "limit": 10,                ← jumlah data per halaman
      "totalItems": 25,           ← total seluruh data
      "totalPages": 3             ← total halaman (ceil(25/10) = 3)
    }
  }
}
```

### Implementasi di Backend

**Categories:**

```
File: backend/src/modules/categories/services/categories.service.ts → findAll()

const { page = 1, limit = 10, search } = query;
const offset = (page - 1) * limit;    ← hitung offset dari page & limit

const { rows, count } = await this.categoryModel.findAndCountAll({
  where, limit, offset, ...
});

return {
  items: rows,                         ← data halaman ini
  meta: {
    page,
    limit,
    totalItems: count,                 ← total seluruh data
    totalPages: Math.ceil(count / limit), ← hitung total halaman
  },
};
```

**Products:**

```
File: backend/src/modules/products/services/products.service.ts → findAll()

// Sama persis pattern-nya: findAndCountAll → return { items, meta }
```

### Implementasi di Frontend

**Tipe data pagination:**

```
File: frontend/src/types/api.types.ts

interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}
```

**Komponen Pagination:**

```
File: frontend/src/components/ui/Pagination.tsx

- Tampilkan tombol halaman 1, 2, 3, ...
- Tombol previous / next
- Disable kalau sudah di halaman pertama / terakhir
- Panggil onPageChange(page) saat user klik
```

**Penggunaan di halaman:**

```
File: frontend/src/pages/ProductsPage.tsx

<Pagination
  currentPage={meta.page}           ← halaman aktif
  totalPages={meta.totalPages}      ← total halaman
  onPageChange={setPage}            ← callback ganti halaman
/>
```

### Query Parameters

| Parameter  | Tipe   | Default | Keterangan                         |
| ---------- | ------ | ------- | ---------------------------------- |
| page       | number | 1       | Halaman yang diminta               |
| limit      | number | 10      | Jumlah data per halaman            |
| search     | string | -       | Kata kunci pencarian               |
| categoryId | number | -       | Filter by category (products only) |

### File Terkait

| File                       | Lokasi                                                          | Fungsi                                                    |
| -------------------------- | --------------------------------------------------------------- | --------------------------------------------------------- |
| categories.service.ts (BE) | `backend/src/modules/categories/services/categories.service.ts` | Pagination logic categories                               |
| products.service.ts (BE)   | `backend/src/modules/products/services/products.service.ts`     | Pagination logic products                                 |
| query-category.dto.ts      | `backend/src/modules/categories/dto/query-category.dto.ts`      | Validasi query params (page, limit, search)               |
| query-product.dto.ts       | `backend/src/modules/products/dto/query-product.dto.ts`         | Validasi query params (page, limit, search, categoryId)   |
| api.types.ts               | `frontend/src/types/api.types.ts`                               | Interface PaginationMeta & PaginatedResponse              |
| Pagination.tsx             | `frontend/src/components/ui/Pagination.tsx`                     | Komponen UI pagination                                    |
| transform.interceptor.ts   | `backend/src/common/interceptors/transform.interceptor.ts`      | Bungkus semua response jadi { statusCode, message, data } |

---

## 6. Pattern MVC

### Penjelasan

MVC (**Model – View – Controller**) adalah pola arsitektur yang memisahkan kode menjadi 3 tanggung jawab:

| Layer          | Tanggung Jawab                                            | Implementasi di Project Ini                    |
| -------------- | --------------------------------------------------------- | ---------------------------------------------- |
| **Model**      | Representasi data & interaksi database                    | File `*.model.ts` (Sequelize models)           |
| **View**       | Tampilan / UI                                             | Seluruh **React frontend** (pages, components) |
| **Controller** | Menerima request, memanggil logic, mengembalikan response | File `*.controller.ts` + `*.service.ts`        |

### Struktur Folder per Module (Backend)

```
backend/src/modules/products/
├── controllers/
│   └── products.controller.ts   ← [C] CONTROLLER - terima HTTP request
├── services/
│   └── products.service.ts      ← [C] SERVICE - business logic (di NestJS, logic dipisah dari controller)
├── models/
│   └── product.model.ts         ← [M] MODEL - representasi tabel database
├── dto/
│   ├── create-product.dto.ts    ← Validasi input (Create)
│   ├── update-product.dto.ts    ← Validasi input (Update)
│   └── query-product.dto.ts     ← Validasi query parameter
```

### Penjelasan Setiap Layer

#### MODEL (backend/src/modules/\*/models/)

Model mendefinisikan **struktur tabel** dan **relasi** menggunakan Sequelize ORM decorators:

```
File: backend/src/modules/products/models/product.model.ts

@Table({ tableName: 'products' })    ← mapping ke tabel 'products'
export class Product extends Model {
  @Column({ type: DataType.STRING })  ← kolom tabel
  declare name: string;

  @ForeignKey(() => Category)         ← foreign key
  declare categoryId: number;

  @BelongsTo(() => Category)          ← relasi ke Category
  category: Category;
}
```

```
File: backend/src/modules/categories/models/category.model.ts

@Table({ tableName: 'categories' })
export class Category extends Model {
  @HasMany(() => Product)             ← relasi 1:many
  products: Product[];
}
```

Model **TIDAK** berisi business logic. Model hanya definisi struktur data.

#### VIEW (frontend/src/)

Karena ini fullstack app, **View = React frontend** yang mengonsumsi REST API:

```
frontend/src/pages/
├── LoginPage.tsx           ← View halaman login
├── DashboardPage.tsx       ← View dashboard
├── CategoriesPage.tsx      ← View list categories
├── CategoryDetailPage.tsx  ← View detail category
├── ProductsPage.tsx        ← View list products
├── ProductDetailPage.tsx   ← View detail product
```

View **hanya menampilkan data**. Data didapat dari API melalui service layer frontend.

#### CONTROLLER + SERVICE (backend/src/modules/\*/controllers/ dan services/)

Di NestJS, Controller dan Service **dipisah** untuk separation of concerns:

**Controller** — hanya terima request dan return response:

```
File: backend/src/modules/products/controllers/products.controller.ts

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query() query: QueryProductDto) {
    return this.productsService.findAll(query);   ← delegasi ke service
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);      ← delegasi ke service
  }

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);      ← delegasi ke service
  }
}
```

**Service** — berisi semua business logic:

```
File: backend/src/modules/products/services/products.service.ts

@Injectable()
export class ProductsService {
  // Ambil semua products: bangun WHERE, pagination, include category
  async findAll(query) { ... }

  // Cari by ID, throw 404 kalau tidak ketemu
  async findOne(id) { ... }

  // Buat baru, return dengan data category
  async create(dto) { ... }

  // Update, return data terbaru
  async update(id, dto) { ... }

  // Hapus, cek dulu apakah ada
  async remove(id) { ... }
}
```

### Alur Request MVC Lengkap (Contoh: Create Product)

```
[View] User isi form di ProductsPage.tsx → klik "Simpan"
    │
    ▼
[View → API] productsService.create(data) → POST /api/v1/products
    │
    ▼
[Controller] products.controller.ts → @Post() create(@Body() dto)
  → Validasi otomatis oleh ValidationPipe + CreateProductDto
  → Kalau valid → panggil productsService.create(dto)
    │
    ▼
[Service] products.service.ts → create(dto)
  → productModel.create(dto)      ← interaksi dengan Model
  → this.findOne(product.id)      ← ambil data lengkap + category
    │
    ▼
[Model] product.model.ts
  → Sequelize INSERT ke tabel products
  → Sequelize SELECT JOIN categories
    │
    ▼
[Response] { statusCode: 201, message: "Success", data: { product + category } }
    │
    ▼
[View] ProductsPage.tsx → toast.success("Product berhasil ditambah") → refresh tabel
```

### File Terkait (Semua MVC)

| Layer          | File                     | Lokasi                                        |
| -------------- | ------------------------ | --------------------------------------------- |
| **Model**      | category.model.ts        | `backend/src/modules/categories/models/`      |
| **Model**      | product.model.ts         | `backend/src/modules/products/models/`        |
| **Model**      | user.model.ts            | `backend/src/modules/users/models/`           |
| **Controller** | categories.controller.ts | `backend/src/modules/categories/controllers/` |
| **Controller** | products.controller.ts   | `backend/src/modules/products/controllers/`   |
| **Controller** | auth.controller.ts       | `backend/src/modules/auth/controllers/`       |
| **Service**    | categories.service.ts    | `backend/src/modules/categories/services/`    |
| **Service**    | products.service.ts      | `backend/src/modules/products/services/`      |
| **Service**    | auth.service.ts          | `backend/src/modules/auth/services/`          |
| **View**       | CategoriesPage.tsx       | `frontend/src/pages/`                         |
| **View**       | ProductsPage.tsx         | `frontend/src/pages/`                         |
| **View**       | CategoryDetailPage.tsx   | `frontend/src/pages/`                         |
| **View**       | ProductDetailPage.tsx    | `frontend/src/pages/`                         |
| **View**       | LoginPage.tsx            | `frontend/src/pages/`                         |
| **View**       | DashboardPage.tsx        | `frontend/src/pages/`                         |
| **DTO**        | create-product.dto.ts    | `backend/src/modules/products/dto/`           |
| **DTO**        | create-category.dto.ts   | `backend/src/modules/categories/dto/`         |

---

## 7. Implementasi Error Handling

### Penjelasan

Error handling di project ini ada di **6 layer** yang saling melengkapi: 3 di backend dan 3 di frontend.

---

### BACKEND ERROR HANDLING

#### Layer 1: ValidationPipe + DTO (Validasi Input)

**Apa fungsinya?**
Validasi otomatis setiap data yang masuk ke API. Kalau input tidak valid, langsung ditolak **sebelum** masuk ke controller/service.

**Di mana diaktifkan?**

```
File: backend/src/main.ts

app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,           ← buang field yang tidak ada di DTO
    forbidNonWhitelisted: true,← error kalau kirim field asing
    transform: true,           ← auto-convert tipe data (string "1" → number 1)
    exceptionFactory: (errors) => {
      // Custom format error: kembalikan field + pesan per field
      const details = errors.map((err) => ({
        field: err.property,
        message: Object.values(err.constraints || {})[0],
      }));
      return new BadRequestException({ message: 'Validation failed', details });
    },
  }),
);
```

**Contoh DTO yang divalidasi:**

```
File: backend/src/modules/products/dto/create-product.dto.ts

@IsInt({ message: 'Category ID harus integer' })
@IsNotEmpty({ message: 'Category ID wajib diisi' })
categoryId: number;

@IsString()
@IsNotEmpty({ message: 'Nama produk wajib diisi' })
name: string;

@IsNumber({}, { message: 'Harga harus berupa angka' })
@Min(0, { message: 'Harga tidak boleh negatif' })
price: number;
```

**Contoh response error validasi:**

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "BAD_REQUEST",
  "details": [
    { "field": "name", "message": "Nama produk wajib diisi" },
    { "field": "price", "message": "Harga harus berupa angka" }
  ],
  "timestamp": "2026-02-07T10:30:00.000Z"
}
```

**Jenis error yang ditangkap:** Input kosong, tipe data salah, nilai di bawah minimum, format email salah, field tidak dikenal.

---

#### Layer 2: Service Layer Exceptions (Error Logic Bisnis)

**Apa fungsinya?**
Menangani error yang terkait **logic bisnis**, misalnya data tidak ditemukan, email duplikat, password salah, dll.

**Exception yang digunakan:**

| Exception               | HTTP Status | Kapan Dipakai                                          | File                                       |
| ----------------------- | ----------- | ------------------------------------------------------ | ------------------------------------------ |
| `NotFoundException`     | 404         | Data tidak ditemukan (findOne)                         | categories.service.ts, products.service.ts |
| `UnauthorizedException` | 401         | Email/password salah, token invalid                    | auth.service.ts, jwt.strategy.ts           |
| `ConflictException`     | 409         | Email duplikat, hapus category yg masih punya products | auth.service.ts, categories.service.ts     |

**Contoh: NotFoundException (data tidak ditemukan)**

```
File: backend/src/modules/products/services/products.service.ts → findOne()

const product = await this.productModel.findByPk(id, { include: [Category] });
if (!product) {
  throw new NotFoundException(`Product dengan ID ${id} tidak ditemukan`);
}
```

**Contoh: ConflictException (cegah hapus category yang punya products)**

```
File: backend/src/modules/categories/services/categories.service.ts → remove()

const productCount = await Product.count({ where: { categoryId: id } });
if (productCount > 0) {
  throw new ConflictException(
    `Tidak bisa menghapus category "${category.name}" karena masih memiliki ${productCount} product(s).`
  );
}
```

**Contoh: UnauthorizedException (login gagal)**

```
File: backend/src/modules/auth/services/auth.service.ts → login()

if (!user) {
  throw new UnauthorizedException('Email atau password salah');
}
const isPasswordValid = await bcrypt.compare(dto.password, user.password);
if (!isPasswordValid) {
  throw new UnauthorizedException('Email atau password salah');
}
```

> Pesan error **sama** untuk email & password supaya hacker tidak bisa tahu mana yang salah.

---

#### Layer 3: Global Exception Filter (Tangkap SEMUA Error)

**Apa fungsinya?**
Filter paling luar yang menangkap **SEMUA error** dari seluruh aplikasi (termasuk error yang tidak terduga), lalu format jadi response JSON yang konsisten.

**Di mana diaktifkan?**

```
File: backend/src/main.ts

app.useGlobalFilters(new AllExceptionsFilter());
```

**Implementasi lengkap:**

```
File: backend/src/common/filters/http-exception.filter.ts

@Catch()    ← tangkap SEMUA jenis exception
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // 1. HttpException (BadRequest, NotFound, Unauthorized, Conflict)
    if (exception instanceof HttpException) {
      → ambil status code & message dari exception
    }
    // 2. Database errors (Sequelize ORM)
    else if (this.isSequelizeError(exception)) {
      → SequelizeUniqueConstraintError    → 409 "Data sudah ada (duplikat)"
      → SequelizeForeignKeyConstraintError → 409 "Tidak bisa hapus, data terhubung"
      → SequelizeValidationError          → 400 "Validasi database gagal"
      → SequelizeConnectionError          → 503 "Koneksi database gagal"
      → SequelizeDatabaseError            → 500 "Kesalahan database"
    }
    // 3. Generic JS Error
    else if (exception instanceof Error) {
      → ambil error.message
    }

    // Format response: SELALU konsisten
    response.status(status).json({
      statusCode: status,
      message,
      error: HttpStatus[status],
      details,
      timestamp: new Date().toISOString(),
    });
  }
}
```

**Jenis database error yang ditangkap:**

| Error Sequelize                    | Status | Pesan                            | Contoh Kasus                                           |
| ---------------------------------- | ------ | -------------------------------- | ------------------------------------------------------ |
| SequelizeUniqueConstraintError     | 409    | Data sudah ada (duplikat)        | Insert email yang sudah ada                            |
| SequelizeForeignKeyConstraintError | 409    | Tidak bisa hapus, data terhubung | Hapus category yang masih punya products (di level DB) |
| SequelizeValidationError           | 400    | Validasi database gagal          | Kolom NOT NULL diisi null                              |
| SequelizeConnectionError           | 503    | Koneksi database gagal           | MySQL mati / salah config                              |
| SequelizeDatabaseError             | 500    | Kesalahan database               | Query syntax error                                     |

---

### FRONTEND ERROR HANDLING

#### Layer 4: Axios Interceptor (Handle 401 Otomatis)

**Apa fungsinya?**
Kalau response dari API status 401 (Unauthorized), otomatis hapus token & redirect ke halaman login. User tidak perlu manual logout.

```
File: frontend/src/services/api.ts

api.interceptors.response.use(
  (response) => response,    ← kalau sukses, teruskan
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");   ← hapus token
      window.location.href = "/login";    ← redirect ke login
    }
    return Promise.reject(error);         ← teruskan error ke caller
  },
);
```

**Kapan terjadi?** Token expired, token invalid, user dihapus dari database.

---

#### Layer 5: Error Utility + Toast Notification (Handle Error API di UI)

**Apa fungsinya?**
Setiap aksi CRUD di frontend dibungkus try-catch. Kalau error, pesan dari backend diekstrak dan ditampilkan sebagai toast notification.

```
File: frontend/src/utils/error.ts

export function getErrorMessage(error: unknown, fallback = "Terjadi kesalahan"): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || fallback;
    // ↑ Ambil pesan dari backend (misal: "Email atau password salah")
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}
```

**Penggunaan di halaman:**

```
File: frontend/src/pages/ProductsPage.tsx

const onSave = async (data) => {
  try {
    await productsService.create(data);
    toast.success("Product berhasil ditambah");    ← sukses: toast hijau
  } catch (error) {
    toast.error(getErrorMessage(error, "Gagal menyimpan"));  ← gagal: toast merah + pesan dari API
  }
};
```

**Diterapkan di SEMUA aksi:** create, update, delete categories & products, login.

---

#### Layer 6: React Error Boundary (Tangkap Crash React)

**Apa fungsinya?**
Kalau ada error JavaScript yang tidak tertangkap di komponen React (misalnya render error), Error Boundary menangkapnya dan menampilkan halaman error yang user-friendly, bukan layar putih.

```
File: frontend/src/components/ErrorBoundary.tsx

export default class ErrorBoundary extends Component {
  static getDerivedStateFromError(error) {
    return { hasError: true, error };    ← tangkap error, set state
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);  ← log untuk debugging
  }

  render() {
    if (this.state.hasError) {
      return (
        // Tampilkan halaman error dengan pesan + tombol "Kembali ke Dashboard"
      );
    }
    return this.props.children;  ← kalau tidak ada error, render anak seperti biasa
  }
}
```

**Diaktifkan di:**

```
File: frontend/src/App.tsx

<ErrorBoundary>       ← bungkus seluruh app
  <BrowserRouter>
    ...
  </BrowserRouter>
</ErrorBoundary>
```

---

#### Validasi Form (Bonus - Client-Side)

Selain error handling dari API, form di frontend juga punya **validasi client-side** sebelum data dikirim ke API:

```
File: frontend/src/pages/ProductsPage.tsx

// Zod schema
const productSchema = z.object({
  name: z.string().min(1, "Nama product wajib diisi"),
  categoryId: z.string().min(1, "Pilih category").transform(Number),
  price: z.string().min(1, "Harga wajib diisi").transform(Number)
         .pipe(z.number().positive("Harga harus lebih dari 0")),
});

// React Hook Form + Zod resolver
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(productSchema),
});
```

Validasi ini **mencegah request yang jelas-jelas invalid** sebelum dikirim ke backend (UX lebih baik, mengurangi beban server).

---

### Ringkasan Error Handling: 6 Layer

```
┌──────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                          │
│                                                              │
│  Layer 6: Error Boundary                                     │
│  → Tangkap crash React, tampilkan halaman error              │
│                                                              │
│  Layer 5: getErrorMessage() + toast                          │
│  → Ambil pesan error API, tampilkan ke user                  │
│                                                              │
│  Layer 4: Axios Interceptor                                  │
│  → Auto-redirect ke login jika 401                           │
│                                                              │
│  Bonus: Zod + React Hook Form (validasi client-side)         │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                    BACKEND (NestJS)                           │
│                                                              │
│  Layer 3: AllExceptionsFilter (Global)                       │
│  → Tangkap SEMUA error, format response konsisten            │
│  → Handle: HttpException, Sequelize errors, generic Error    │
│                                                              │
│  Layer 2: Service Layer Exceptions                           │
│  → NotFoundException, UnauthorizedException, ConflictException│
│  → Logic bisnis: data not found, password salah, FK conflict │
│                                                              │
│  Layer 1: ValidationPipe + DTO                               │
│  → Validasi otomatis input (tipe data, required, min, email) │
│  → Tolak request invalid sebelum masuk ke controller         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### File Terkait (Semua Error Handling)

| Layer   | File                           | Lokasi                                                          |
| ------- | ------------------------------ | --------------------------------------------------------------- |
| Layer 1 | main.ts (ValidationPipe)       | `backend/src/main.ts`                                           |
| Layer 1 | create-product.dto.ts          | `backend/src/modules/products/dto/create-product.dto.ts`        |
| Layer 1 | create-category.dto.ts         | `backend/src/modules/categories/dto/create-category.dto.ts`     |
| Layer 1 | login.dto.ts                   | `backend/src/modules/auth/dto/login.dto.ts`                     |
| Layer 1 | register.dto.ts                | `backend/src/modules/auth/dto/register.dto.ts`                  |
| Layer 2 | products.service.ts            | `backend/src/modules/products/services/products.service.ts`     |
| Layer 2 | categories.service.ts          | `backend/src/modules/categories/services/categories.service.ts` |
| Layer 2 | auth.service.ts                | `backend/src/modules/auth/services/auth.service.ts`             |
| Layer 2 | jwt.strategy.ts                | `backend/src/modules/auth/strategies/jwt.strategy.ts`           |
| Layer 3 | http-exception.filter.ts       | `backend/src/common/filters/http-exception.filter.ts`           |
| Layer 4 | api.ts                         | `frontend/src/services/api.ts`                                  |
| Layer 5 | error.ts                       | `frontend/src/utils/error.ts`                                   |
| Layer 5 | ProductsPage.tsx (try-catch)   | `frontend/src/pages/ProductsPage.tsx`                           |
| Layer 5 | CategoriesPage.tsx (try-catch) | `frontend/src/pages/CategoriesPage.tsx`                         |
| Layer 5 | LoginPage.tsx (try-catch)      | `frontend/src/pages/LoginPage.tsx`                              |
| Layer 6 | ErrorBoundary.tsx              | `frontend/src/components/ErrorBoundary.tsx`                     |
| Layer 6 | App.tsx (wrap ErrorBoundary)   | `frontend/src/App.tsx`                                          |
