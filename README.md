<div align="center">

# Admin Panel - Product Management System

A fullstack admin panel for managing **Categories** and **Products**, built with modern web technologies. Features JWT authentication, complete CRUD operations, search, pagination, and detailed view pages.

![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)

<br />

![App Preview](docs/screenshots/dashboard.png)

[Features](#-features) · [Screenshots](#-screenshots) · [Getting Started](#-getting-started) · [API Docs](#-api-documentation) · [Architecture](#-architecture)

</div>

---

## Table of Contents

- [Screenshots](#-screenshots)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Database Setup](#2-database-setup)
  - [3. Backend Setup](#3-backend-setup)
  - [4. Frontend Setup](#4-frontend-setup)
  - [5. Default Account](#5-default-account)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
  - [Authentication](#authentication)
  - [Categories](#categories)
  - [Products](#products)
  - [Query Parameters](#query-parameters)
  - [Response Format](#response-format)
- [Architecture](#-architecture)
  - [Backend (MVC Pattern)](#backend-mvc-pattern)
  - [Frontend Architecture](#frontend-architecture)
  - [Database Design](#database-design)
- [Error Handling](#-error-handling)
- [Dependencies](#-dependencies)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Deployment Notes](#-deployment-notes)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## Screenshots

### Login Page

The login page features a modern split-layout design — a branding illustration on the left and a clean login form on the right. Form validation is handled client-side with Zod before any request is sent.

![Login Page](docs/screenshots/login.png)

### Dashboard

The dashboard provides a quick overview with statistics cards showing total categories, total products, admin users count, and API status. Clean card-based layout with gradient accents and quick navigation buttons.

![Dashboard](docs/screenshots/dashboard.png)

---

## Features

### Authentication & Security

- JWT-based authentication with configurable expiration
- Password hashing with bcrypt (10 salt rounds)
- Protected routes — all admin pages require a valid token
- Automatic redirect to login when the token expires
- Passport.js strategy integration for extensibility

### Categories (CRUD)

- List all categories with server-side pagination and search
- View category detail with the list of products under it
- Create new categories via a validated modal form
- Edit existing categories inline
- Delete categories with a safety check — cannot delete if products still reference it

### Products (CRUD)

- List products with pagination, search by name, and filter by category
- View product detail with price, stock, description, and parent category link
- Create/edit products with form validation (name, category, price, stock)
- Automatic Rupiah currency formatting for prices
- Delete products with a confirmation modal

### User Experience

- Loading skeletons while data is being fetched
- Toast notifications for every user action (success/error)
- Fully responsive layout (mobile, tablet, desktop)
- Modern rounded UI design with gradient accents
- React Error Boundary to gracefully handle unexpected crashes
- Smooth sidebar navigation with active route highlighting

---

## Tech Stack

| Layer        | Technology                                                                        |
| ------------ | --------------------------------------------------------------------------------- |
| **Frontend** | React 19, TypeScript, Vite 7, TailwindCSS 4, Zustand, Axios, React Hook Form, Zod |
| **Backend**  | NestJS 11, TypeScript, Sequelize ORM, Passport JWT, Swagger (OpenAPI)             |
| **Database** | MySQL 8.0                                                                         |

---

## Prerequisites

Before you begin, make sure you have the following installed on your machine:

| Software    | Minimum Version | Download Link                                 |
| ----------- | --------------: | --------------------------------------------- |
| **Node.js** |            18.x | [nodejs.org](https://nodejs.org/)             |
| **npm**     |             9.x | Comes with Node.js                            |
| **MySQL**   |             8.0 | [mysql.com](https://dev.mysql.com/downloads/) |
| **Git**     |             2.x | [git-scm.com](https://git-scm.com/)           |

You can verify your installation by running:

```bash
node -v    # Should print v18.x.x or higher
npm -v     # Should print 9.x.x or higher
mysql --version
git --version
```

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/admin-panel.git
cd admin-panel
```

### 2. Database Setup

Open your MySQL client (MySQL Workbench, terminal, or any GUI) and create the database:

```sql
CREATE DATABASE admin_panel;
```

> The tables will be created automatically when you start the backend server — Sequelize handles the synchronization based on the model definitions.

### 3. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install all dependencies
npm install

# Create your environment file
cp .env.example .env
```

Now open the `.env` file and fill in your database credentials:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
DB_NAME=admin_panel

# JWT Configuration
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=24h

# Server
PORT=3001
```

> **Important:** Change `JWT_SECRET` to a strong, random string in production. Never commit your `.env` file to version control.

Start the development server:

```bash
npm run start:dev
```

If everything is set up correctly, you'll see:

```
Server berjalan di http://localhost:3001
Swagger docs di http://localhost:3001/api/docs
✅ Seeder: User admin berhasil dibuat
✅ Seeder: Categories berhasil dibuat
✅ Seeder: Products berhasil dibuat
```

The backend is now running at **http://localhost:3001** and the Swagger documentation is available at **http://localhost:3001/api/docs**.

### 4. Frontend Setup

Open a new terminal window:

```bash
# Navigate to the frontend directory
cd frontend

# Install all dependencies
npm install

# Start the development server
npm run dev
```

The frontend is now running at **http://localhost:5173**. Open this URL in your browser.

### 5. Default Account

When the backend starts for the first time, it automatically seeds the database with a default admin account and sample data (5 categories and 13 products):

| Field    | Value               |
| -------- | ------------------- |
| Email    | `admin@example.com` |
| Password | `password123`       |

Use these credentials to log in and explore the application.

---

## Project Structure

```
.
├── backend/                    # NestJS API server
│   ├── src/
│   │   ├── main.ts             # Entry point, bootstrap, Swagger setup
│   │   ├── app.module.ts       # Root module
│   │   ├── common/             # Shared utilities
│   │   │   ├── filters/        # Global exception filter
│   │   │   ├── guards/         # JWT authentication guard
│   │   │   └── interceptors/   # Response transformation interceptor
│   │   ├── config/             # Database & JWT configuration
│   │   ├── database/           # Database module & seeders
│   │   └── modules/
│   │       ├── auth/           # Authentication (login, register, JWT)
│   │       ├── categories/     # Categories CRUD module
│   │       ├── products/       # Products CRUD module
│   │       └── users/          # User management module
│   ├── test/                   # E2E tests
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── main.tsx            # React entry point
│   │   ├── App.tsx             # Router & layout setup
│   │   ├── components/
│   │   │   ├── auth/           # ProtectedRoute component
│   │   │   ├── layout/         # Header, Sidebar, MainLayout
│   │   │   └── ui/             # Reusable UI (Pagination, DeleteModal)
│   │   ├── pages/              # Page components (Dashboard, CRUD pages)
│   │   ├── services/           # API service layer (Axios calls)
│   │   ├── store/              # Zustand state management
│   │   ├── types/              # TypeScript type definitions
│   │   └── utils/              # Utility functions
│   ├── package.json
│   └── vite.config.ts
│
├── docs/
│   ├── api/                    # Postman collection
│   └── screenshots/            # Application screenshots
│
└── README.md
```

---

## API Documentation

The API follows RESTful conventions and uses a versioned prefix `/api/v1`. All responses are wrapped in a standard format (see [Response Format](#response-format)).

Interactive Swagger documentation is available at **http://localhost:3001/api/docs** while the server is running. You can also import the Postman collection from `docs/api/postman_collection.json`.

### Authentication

| Method | Endpoint                | Auth | Description                                    |
| ------ | ----------------------- | ---- | ---------------------------------------------- |
| POST   | `/api/v1/auth/login`    | No   | Login with email & password, returns JWT token |
| POST   | `/api/v1/auth/register` | No   | Register a new user account                    |
| GET    | `/api/v1/auth/profile`  | JWT  | Get the currently authenticated user's profile |

**Login Example:**

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

Use the returned `access_token` as a Bearer token in subsequent requests:

```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  http://localhost:3001/api/v1/categories
```

### Categories

| Method | Endpoint                 | Auth | Description                 |
| ------ | ------------------------ | ---- | --------------------------- |
| GET    | `/api/v1/categories`     | JWT  | List categories (paginated) |
| GET    | `/api/v1/categories/:id` | JWT  | Get category detail         |
| POST   | `/api/v1/categories`     | JWT  | Create a new category       |
| PATCH  | `/api/v1/categories/:id` | JWT  | Update an existing category |
| DELETE | `/api/v1/categories/:id` | JWT  | Delete a category           |

**Create Category Example:**

```bash
curl -X POST http://localhost:3001/api/v1/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name": "Furniture", "description": "Home and office furniture"}'
```

### Products

| Method | Endpoint               | Auth | Description                |
| ------ | ---------------------- | ---- | -------------------------- |
| GET    | `/api/v1/products`     | JWT  | List products (paginated)  |
| GET    | `/api/v1/products/:id` | JWT  | Get product detail         |
| POST   | `/api/v1/products`     | JWT  | Create a new product       |
| PATCH  | `/api/v1/products/:id` | JWT  | Update an existing product |
| DELETE | `/api/v1/products/:id` | JWT  | Delete a product           |

**Create Product Example:**

```bash
curl -X POST http://localhost:3001/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Standing Desk",
    "categoryId": 1,
    "price": 3500000,
    "stock": 10,
    "description": "Adjustable height standing desk"
  }'
```

### Query Parameters

For all list endpoints (`GET /categories`, `GET /products`):

| Parameter    | Type   | Default | Description                                 |
| ------------ | ------ | ------- | ------------------------------------------- |
| `page`       | number | 1       | Page number for pagination                  |
| `limit`      | number | 10      | Number of items per page                    |
| `search`     | string | —       | Search keyword (filters by name)            |
| `categoryId` | number | —       | Filter products by category (products only) |

**Example:**

```bash
# Get page 2 of products, 5 per page, filtered by category 1
curl "http://localhost:3001/api/v1/products?page=2&limit=5&categoryId=1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Response Format

All API responses follow a consistent structure:

**Success Response:**

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

**Error Response:**

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

## Architecture

### Backend (MVC Pattern)

The backend follows the **MVC (Model-View-Controller)** pattern adapted for NestJS:

```
backend/src/modules/{module}/
├── controllers/    → Controller  : Handles HTTP requests, delegates to services
├── services/       → Service     : Contains business logic, database queries
├── models/         → Model       : Sequelize model (table definition, relations)
├── dto/            → DTO         : Data Transfer Objects for input validation
```

- **Model** — Defines the database table structure using Sequelize decorators (`@Table`, `@Column`, `@HasMany`, `@BelongsTo`). Each model maps directly to a MySQL table.
- **Controller** — The entry point for HTTP requests. Controllers parse the request, call the appropriate service method, and return the response. They contain no business logic.
- **Service** — All business logic lives here. Services interact with models to query the database, enforce business rules (e.g., "cannot delete a category with products"), and transform data.
- **DTO** — Validates incoming request data using `class-validator` decorators. Invalid requests are rejected before reaching the controller.
- **View** — In this fullstack architecture, the "View" is the React frontend, which consumes the REST API.

### Frontend Architecture

```
frontend/src/
├── pages/          → Page-level components (one per route)
├── components/     → Reusable UI components
├── services/       → API service layer (Axios HTTP calls)
├── store/          → Zustand store (global auth state)
├── types/          → TypeScript interfaces & types
└── utils/          → Helper functions (error parsing, etc.)
```

Key patterns used:

- **Zustand** for lightweight global state (authentication token, user info)
- **React Hook Form + Zod** for type-safe form validation
- **Axios interceptors** for automatic token injection and 401 handling
- **React Error Boundary** as a last-resort crash handler
- **Service layer abstraction** — components never call Axios directly

### Database Design

The application uses three tables with the following relationships:

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

**Relationships:**

- `categories` → `products` : **One-to-Many** (1 category has many products, 1 product belongs to 1 category)
- Foreign key: `products.category_id` references `categories.id`

---

## Error Handling

The application implements multi-layer error handling on both sides:

### Backend Error Layers

| Layer                       | What It Does                                                                                   |
| --------------------------- | ---------------------------------------------------------------------------------------------- |
| **Global Exception Filter** | Catches all unhandled exceptions and formats them into a consistent JSON response              |
| **ValidationPipe**          | Automatically validates incoming DTOs using `class-validator` decorators                       |
| **Service Layer**           | Throws specific exceptions (`NotFoundException`, `ConflictException`, `UnauthorizedException`) |
| **Database Error Handler**  | Catches Sequelize-specific errors (unique constraint, foreign key, connection)                 |

### Frontend Error Layers

| Layer                   | What It Does                                                                    |
| ----------------------- | ------------------------------------------------------------------------------- |
| **Error Boundary**      | React component that catches rendering crashes and shows a fallback UI          |
| **Axios Interceptor**   | Automatically redirects to the login page on 401 (Unauthorized) responses       |
| **`getErrorMessage()`** | Utility function that extracts human-readable error messages from API responses |
| **Toast Notifications** | Provides immediate visual feedback for every user action                        |
| **Form Validation**     | Client-side validation using Zod schemas prevents invalid submissions           |

---

## Dependencies

### Backend Dependencies

| Package                | Purpose                                               |
| ---------------------- | ----------------------------------------------------- |
| `@nestjs/core`         | Core NestJS framework                                 |
| `@nestjs/config`       | Environment variable management via `.env` files      |
| `@nestjs/jwt`          | JWT token generation and verification                 |
| `@nestjs/passport`     | Passport.js integration for authentication strategies |
| `@nestjs/sequelize`    | Sequelize ORM integration with NestJS                 |
| `@nestjs/swagger`      | Auto-generated OpenAPI/Swagger documentation          |
| `sequelize`            | SQL ORM for querying MySQL                            |
| `sequelize-typescript` | TypeScript decorators for Sequelize models            |
| `mysql2`               | MySQL database driver                                 |
| `bcrypt`               | Secure password hashing                               |
| `class-validator`      | DTO validation decorators                             |
| `class-transformer`    | Automatic type transformation for DTOs                |
| `passport-jwt`         | JWT extraction and verification strategy              |

### Frontend Dependencies

| Package               | Purpose                                          |
| --------------------- | ------------------------------------------------ |
| `react` (v19)         | UI library                                       |
| `react-router-dom`    | Client-side routing and navigation               |
| `axios`               | HTTP client for API communication                |
| `zustand`             | Lightweight global state management              |
| `react-hook-form`     | Performant form handling with minimal re-renders |
| `zod`                 | TypeScript-first schema validation               |
| `@hookform/resolvers` | Connects Zod schemas to React Hook Form          |
| `tailwindcss` (v4)    | Utility-first CSS framework                      |
| `lucide-react`        | Modern icon library (Feather-based)              |
| `react-hot-toast`     | Lightweight toast notifications                  |

---

## Environment Variables

Create a `.env` file in the `backend/` directory:

| Variable         | Required | Default       | Description                         |
| ---------------- | -------- | ------------- | ----------------------------------- |
| `DB_HOST`        | Yes      | `localhost`   | MySQL server hostname               |
| `DB_PORT`        | Yes      | `3306`        | MySQL server port                   |
| `DB_USERNAME`    | Yes      | `root`        | MySQL username                      |
| `DB_PASSWORD`    | Yes      | —             | MySQL password                      |
| `DB_NAME`        | Yes      | `admin_panel` | MySQL database name                 |
| `JWT_SECRET`     | Yes      | —             | Secret key for signing JWT tokens   |
| `JWT_EXPIRES_IN` | No       | `24h`         | Token expiration (e.g., `1h`, `7d`) |
| `PORT`           | No       | `3001`        | Backend server port                 |

---

## Available Scripts

### Backend (`cd backend`)

| Command              | Description                                       |
| -------------------- | ------------------------------------------------- |
| `npm run start:dev`  | Start in development mode with hot-reload (watch) |
| `npm run start`      | Start in standard mode                            |
| `npm run start:prod` | Start from compiled `dist/` (production)          |
| `npm run build`      | Compile TypeScript to JavaScript                  |
| `npm run lint`       | Run ESLint with auto-fix                          |
| `npm run test`       | Run unit tests with Jest                          |
| `npm run test:e2e`   | Run end-to-end tests                              |
| `npm run test:cov`   | Run tests with coverage report                    |
| `npm run format`     | Format code with Prettier                         |

### Frontend (`cd frontend`)

| Command           | Description                            |
| ----------------- | -------------------------------------- |
| `npm run dev`     | Start Vite development server with HMR |
| `npm run build`   | Type-check and build for production    |
| `npm run preview` | Preview the production build locally   |
| `npm run lint`    | Run ESLint                             |

---

## Deployment Notes

Here are some important things to keep in mind when deploying to production:

1. **Disable database auto-sync.** In `backend/src/config/database.config.ts`, change `synchronize: true` to `false`. Use proper Sequelize migrations instead of auto-sync in production to prevent accidental data loss.

2. **Use a strong JWT secret.** Generate a secure random string (at least 32 characters) for `JWT_SECRET`. You can generate one with:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Build the frontend.** Run `npm run build` in the `frontend/` directory and serve the resulting `dist/` folder with a static file server (Nginx, Caddy, etc.).

4. **Build the backend.** Run `npm run build` in the `backend/` directory, then start with `npm run start:prod`.

5. **Configure CORS.** Update the `origin` array in `backend/src/main.ts` to include your production frontend URL instead of `localhost`.

6. **Environment variables.** Use your hosting platform's environment variable management (not `.env` files) in production.

7. **Database seeder.** The initial seeder only runs when the tables are empty, so it won't duplicate data on subsequent starts. However, you should change the default admin password after the first login.

---

## Troubleshooting

### Backend won't start

- **"Access denied for user 'root'"** — Check your `DB_USERNAME` and `DB_PASSWORD` in `.env`. Make sure MySQL is running and the credentials are correct.
- **"Unknown database 'admin_panel'"** — You forgot to create the database. Run `CREATE DATABASE admin_panel;` in your MySQL client.
- **Port already in use** — Another process is using port 3001. Either stop that process or change `PORT` in your `.env`.

### Frontend can't connect to the API

- Make sure the backend is running on `http://localhost:3001`.
- Check that CORS is enabled for `http://localhost:5173` in `backend/src/main.ts`.
- If you changed the backend port, update the base URL in `frontend/src/services/api.ts`.

### Login doesn't work

- Run the backend at least once to allow the seeder to create the default admin account.
- Make sure you're using the exact credentials: `admin@example.com` / `password123`.
- If you've run the backend before and changed data, the seeder won't re-create the admin (it only seeds when the table is empty).

### "Cannot delete category"

This is expected behavior. A category cannot be deleted if it still has products associated with it. Delete or move all products in that category first, then try again.

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please make sure your code follows the existing style and passes linting before submitting.

---

## License

This project is unlicensed and intended for educational/challenge purposes.

---

<div align="center">

**Built with** NestJS + React + TypeScript

</div>
