# DIAGRAM - Admin Panel Product Management System

> Format Mermaid - langsung bisa di-render di VS Code, GitHub, dan Draw.io!

---

## 🎯 Cara Pakai

### ✅ Di VS Code (Recommended):

1. Install extension: **Markdown Preview Mermaid Support**
2. Buka file ini, tekan `Ctrl+Shift+V` untuk preview
3. Diagram langsung ter-render!

### ✅ Di GitHub:

- Langsung otomatis ter-render di README.md atau file .md apapun

### ✅ Di Draw.io:

1. Buka [draw.io](https://app.diagrams.net/)
2. Klik **Arrange** → **Insert** → **Advanced** → **Mermaid**
3. Copy-paste kode Mermaid di bawah
4. Klik **Insert**

---

## 1. ERD (Entity Relationship Diagram) - Database Tables

```mermaid
erDiagram
    categories ||--o{ products : "has many"

    users {
        int id PK "Auto Increment"
        varchar(255) email UK "Unique"
        varchar(255) password
        varchar(100) name
        enum role "admin"
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    categories {
        int id PK "Auto Increment"
        varchar(100) name
        text description
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    products {
        int id PK "Auto Increment"
        int category_id FK
        varchar(200) name
        text description
        decimal(12,2) price
        int stock
        boolean is_active
        datetime created_at
        datetime updated_at
    }
```

**Keterangan:**

- 🔑 PK = Primary Key (Auto Increment)
- 🔗 FK = Foreign Key
- UK = Unique Key
- `categories` → `products` = One to Many relationship

---

## 2. Arsitektur Sistem (System Architecture)

```mermaid
flowchart TB
    subgraph CLIENT["🖥️ CLIENT (Browser)"]
        direction TB
        REACT["React 19 + TypeScript"]
        VITE["Vite (Build Tool)"]
        UI["UI Libraries:<br/>TailwindCSS 4 + Zustand"]
        AXIOS["Axios HTTP Client"]
        PAGES["Pages:<br/>• LoginPage<br/>• DashboardPage<br/>• CategoriesPage<br/>• ProductsPage<br/>• DetailPages"]

        REACT --> VITE
        VITE --> UI
        UI --> PAGES
        PAGES --> AXIOS
    end

    subgraph BACKEND["⚙️ BACKEND (NestJS Server - Port 3001)"]
        direction TB
        NESTJS["NestJS 11 + TypeScript"]
        API["API Routes (/api/v1)"]
        CONTROLLER["Controllers<br/>(Routes/Endpoints)"]
        SERVICE["Services<br/>(Business Logic)"]
        MODEL["Sequelize Models<br/>(ORM)"]
        MIDDLEWARE["Middleware/Guards:<br/>• JwtAuthGuard<br/>• ValidationPipe<br/>• ExceptionFilter<br/>• TransformInterceptor"]

        NESTJS --> API
        API --> CONTROLLER
        CONTROLLER --> SERVICE
        SERVICE --> MODEL
        MIDDLEWARE -.->|Protect| CONTROLLER
    end

    subgraph DATABASE["🗄️ DATABASE"]
        direction TB
        MYSQL[("MySQL 8")]
        TABLES["Tables:<br/>• users<br/>• categories<br/>• products"]
        SEEDER["Seeder:<br/>Admin user + demo data"]

        MYSQL --> TABLES
        SEEDER -.->|Initialize| MYSQL
    end

    AXIOS -->|"HTTP/JSON<br/>(REST API)"| API
    MODEL -->|"SQL Queries"| MYSQL

    style CLIENT fill:#e1d5e7,stroke:#9673a6,stroke-width:3px
    style BACKEND fill:#d5e8d4,stroke:#82b366,stroke-width:3px
    style DATABASE fill:#fff2cc,stroke:#d6b656,stroke-width:3px
```

---

## 3. Authentication Flow

```mermaid
sequenceDiagram
    actor User
    participant Frontend as React Frontend
    participant Backend as NestJS API
    participant DB as MySQL Database
    participant Guard as JWT Guard

    User->>Frontend: 1. Enter credentials
    Frontend->>Backend: 2. POST /api/v1/auth/login<br/>{email, password}
    Backend->>DB: 3. Validate user
    DB-->>Backend: 4. User data
    Backend->>Backend: 5. Generate JWT token
    Backend-->>Frontend: 6. Return {token, user}
    Frontend->>Frontend: 7. Store token in localStorage

    Note over Frontend,Backend: Subsequent Requests

    Frontend->>Backend: 8. GET /api/v1/products<br/>Header: Bearer {token}
    Backend->>Guard: 9. Verify JWT
    Guard-->>Backend: 10. Token valid ✓
    Backend->>DB: 11. Query products
    DB-->>Backend: 12. Products data
    Backend-->>Frontend: 13. Return products
    Frontend->>User: 14. Display data
```

---

## 4. MVC Pattern

```mermaid
graph LR
    subgraph View["VIEW (React)"]
        UI["User Interface<br/>Components & Pages"]
    end

    subgraph Controller["CONTROLLER (NestJS)"]
        CTRL["Controllers<br/>+ Services"]
    end

    subgraph Model["MODEL (Sequelize)"]
        DATA["Models<br/>+ Database"]
    end

    UI -->|"HTTP Request"| CTRL
    CTRL -->|"Response"| UI
    CTRL -->|"Query/Command"| DATA
    DATA -->|"Data"| CTRL

    style View fill:#e1d5e7,stroke:#9673a6
    style Controller fill:#d5e8d4,stroke:#82b366
    style Model fill:#fff2cc,stroke:#d6b656
```

---

## 5. Folder Structure

```mermaid
graph TD
    ROOT["Project Root"]

    ROOT --> FE["frontend/"]
    ROOT --> BE["backend/"]
    ROOT --> DOCS["docs/"]

    FE --> FE_SRC["src/"]
    FE_SRC --> PAGES["pages/"]
    FE_SRC --> COMP["components/"]
    FE_SRC --> SERV["services/"]
    FE_SRC --> STORE["store/"]
    FE_SRC --> TYPES["types/"]

    BE --> BE_SRC["src/"]
    BE_SRC --> MODULES["modules/"]
    BE_SRC --> CONFIG["config/"]
    BE_SRC --> COMMON["common/"]
    BE_SRC --> DB["database/"]

    MODULES --> AUTH["auth/"]
    MODULES --> CAT["categories/"]
    MODULES --> PROD["products/"]
    MODULES --> USERS["users/"]

    COMMON --> GUARDS["guards/"]
    COMMON --> FILTERS["filters/"]
    COMMON --> INTER["interceptors/"]

    style ROOT fill:#fff2cc,stroke:#d6b656
    style FE fill:#e1d5e7,stroke:#9673a6
    style BE fill:#d5e8d4,stroke:#82b366
```

---

## 6. Tech Stack Summary

```mermaid
mindmap
  root((Admin Panel<br/>Product Management))
    Frontend
      React 19
      TypeScript
      Vite
      TailwindCSS 4
      Zustand
      Axios
      Zod Validation
      React Router
    Backend
      NestJS 11
      TypeScript
      Sequelize ORM
      Passport JWT
      Swagger UI
      class-validator
      class-transformer
    Database
      MySQL 8
      Seeder Scripts
      Migrations
    DevOps
      ESLint
      Prettier
      npm/pnpm
      Git
```

---

## 7. API Endpoints

```mermaid
graph TD
    API["/api/v1"]

    API --> AUTH["/auth"]
    API --> CAT["/categories"]
    API --> PROD["/products"]

    AUTH --> LOGIN["POST /login"]
    AUTH --> REG["POST /register"]

    CAT --> CAT_GET["GET / (list)"]
    CAT --> CAT_POST["POST / (create)"]
    CAT --> CAT_ID["GET /:id (detail)"]
    CAT --> CAT_PUT["PUT /:id (update)"]
    CAT --> CAT_DEL["DELETE /:id"]

    PROD --> PROD_GET["GET / (list)"]
    PROD --> PROD_POST["POST / (create)"]
    PROD --> PROD_ID["GET /:id (detail)"]
    PROD --> PROD_PUT["PUT /:id (update)"]
    PROD --> PROD_DEL["DELETE /:id"]

    style API fill:#fff2cc,stroke:#d6b656
    style AUTH fill:#f8cecc,stroke:#b85450
    style CAT fill:#d5e8d4,stroke:#82b366
    style PROD fill:#ffe6cc,stroke:#d79b00
```

---

## 8. Component Hierarchy (Frontend)

```mermaid
graph TD
    APP["App.tsx"]

    APP --> LAYOUT["MainLayout"]
    APP --> LOGIN["LoginPage"]

    LAYOUT --> HEADER["Header"]
    LAYOUT --> SIDEBAR["Sidebar"]
    LAYOUT --> CONTENT["Content Area"]

    CONTENT --> DASH["DashboardPage"]
    CONTENT --> CAT_LIST["CategoriesPage"]
    CONTENT --> CAT_DETAIL["CategoryDetailPage"]
    CONTENT --> PROD_LIST["ProductsPage"]
    CONTENT --> PROD_DETAIL["ProductDetailPage"]

    CAT_LIST --> PAGINATION["Pagination"]
    CAT_LIST --> DELETE_MODAL["DeleteModal"]

    PROD_LIST --> PAGINATION2["Pagination"]
    PROD_LIST --> DELETE_MODAL2["DeleteModal"]

    style APP fill:#fff2cc,stroke:#d6b656
    style LAYOUT fill:#e1d5e7,stroke:#9673a6
    style CONTENT fill:#d5e8d4,stroke:#82b366
```

---

## 📋 Catatan

- **Mermaid** lebih mudah dibaca dan diedit dibanding XML
- Otomatis ter-render di GitHub, VS Code, dan GitLab
- Bisa juga di-import ke Draw.io jika perlu
- Lebih maintainable dan version-control friendly
- Support berbagai jenis diagram: ERD, Flowchart, Sequence, Mindmap, dsb.

---

## 🔗 Resources

- [Mermaid Documentation](https://mermaid.js.org/)
- [Mermaid Live Editor](https://mermaid.live/)
- [Draw.io](https://app.diagrams.net/)
