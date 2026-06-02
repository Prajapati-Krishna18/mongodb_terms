# Notes Management REST APIs (MongoDB & Node.js)

This repository contains a progressive series of backend assignments built using **Node.js, Express, MongoDB, and Mongoose** following the **MVC (Model-View-Controller)** pattern.

## Directory Structure

```directory
mongodb_terms/
├── CRUD_ASSIGNMENT/                 # Assignment 01: Core CRUD REST API
├── Routing_queries_assignment/      # Assignment 02: Params, Pagination, and Sorting
└── Search_combined_queries_assignment/ # Assignment 03: Advanced Search & Combined Queries
```

---

## 📂 Project Overview

### 1. [CRUD_ASSIGNMENT](./CRUD_ASSIGNMENT) (Assignment 01)
Focuses on the fundamentals of REST APIs, database connections, schema design, and clean CRUD operations.
* **Database Connection:** Isolated connection setup using Mongoose.
* **Basic CRUD Operations:**
  * `POST /api/notes` — Create a single note (supports title, content, category, isPinned)
  * `POST /api/notes/bulk` — Create multiple notes at once using `Note.insertMany()`
  * `GET /api/notes` — Fetch all notes
  * `GET /api/notes/:id` — Get note by ID
  * `PUT /api/notes/:id` — Replace note completely
  * `PATCH /api/notes/:id` — Update specific fields partially
  * `DELETE /api/notes/:id` — Delete a single note
  * `DELETE /api/notes/bulk` — Delete multiple notes by IDs

### 2. [Routing_queries_assignment](./Routing_queries_assignment) (Assignment 02)
Extends the core CRUD API with route parameters, query parameters, sorting, and pagination logic.
* **Route Parameters:**
  * `GET /api/notes/category/:category` — Filter notes by category path parameter
  * `GET /api/notes/status/:isPinned` — Filter notes by pin status path parameter
  * `GET /api/notes/:id/summary` — Fetch note summary excluding content
* **Query Parameters & Filtering:**
  * `GET /api/notes/filter?category=work&isPinned=true` — Dynamic filters
  * `GET /api/notes/filter/pinned?category=study` — Get pinned notes
  * `GET /api/notes/filter/category?name=personal` — Category query filtering
  * `GET /api/notes/filter/date-range?from=YYYY-MM-DD&to=YYYY-MM-DD` — Filter by creation dates
* **Pagination:**
  * `GET /api/notes/paginate?page=1&limit=5` — Paginate results returning custom pagination metadata (`total`, `page`, `limit`, `totalPages`, `hasNextPage`, `hasPrevPage`)
  * `GET /api/notes/paginate/category/:category` — Paginate category-specific notes
* **Sorting:**
  * `GET /api/notes/sort?sortBy=title&order=asc` — Sort results by title, category, or creation time
  * `GET /api/notes/sort/pinned` — Sort pinned notes only

### 3. [Search_combined_queries_assignment](./Search_combined_queries_assignment) (Assignment 03)
Builds advanced search APIs and combines multiple query modifiers (search, filter, pagination, and sorting) in single endpoints.
* **MongoDB Regex Search:**
  * `GET /api/notes/search?q=keyword` — Search in note titles case-insensitively
  * `GET /api/notes/search/content?q=keyword` — Search in note content case-insensitively
  * `GET /api/notes/search/all?q=keyword` — Search across both title and content using `$or`
* **Combined Operations:**
  * `GET /api/notes/filter-sort` — Filter by category/pinned and sort results
  * `GET /api/notes/filter-paginate` — Filter and paginate the results
  * `GET /api/notes/sort-paginate` — Sort all notes and paginate the list
  * `GET /api/notes/search-filter` — Search keywords with active category filters
* **Multi-concept Combinations:**
  * `GET /api/notes/search-sort-paginate` — Search, sort, and paginate
  * `GET /api/notes/filter-sort-paginate` — Filter, sort, and paginate
* **Master Endpoint:**
  * `GET /api/notes/query` — Everything at once. Accepts optional `q`, `category`, `isPinned`, `sortBy`, `order`, `page`, and `limit` to build a complete dynamic query.

---

## 🛠️ Tech Stack & Setup

* **Runtime:** Node.js
* **Framework:** Express
* **Database:** MongoDB (using Mongoose ODM)
* **Configuration:** dotenv (env variables)
* **Development:** nodemon (auto-reloader)

### How to Run Locally

1. Ensure you have **Node.js** and **MongoDB** installed and running on your system.
2. Clone the repository and navigate to any assignment directory:
   ```bash
   cd CRUD_ASSIGNMENT
   # or
   cd Routing_queries_assignment
   # or
   cd Search_combined_queries_assignment
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the folder (referencing the `.env.example` in that folder) and add your database configuration:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/your-db-name
   ```
5. Run in development mode:
   ```bash
   npm run dev
   ```
6. The API will be active at `http://localhost:5000/api/notes`.

---

## 📐 MVC Folder Structure

All projects follow this strict MVC architectural structure:
```
notes-app/
├── src/
│   ├── config/          # Database configuration (db.js)
│   ├── models/          # Mongoose Model schemas (note.model.js)
│   ├── controllers/     # API logic, DB queries, and HTTP responses (note.controller.js)
│   ├── routes/          # Express route definitions (note.routes.js)
│   ├── middlewares/     # Middleware folder (left empty for future expansions)
│   ├── app.js           # Express setup, routing mounts, and global error handling
│   └── index.js         # Entrypoint starting the server
├── .env                 # Environment variables
├── .env.example         # Template environment variables
└── package.json         # Package configuration and scripts
```
