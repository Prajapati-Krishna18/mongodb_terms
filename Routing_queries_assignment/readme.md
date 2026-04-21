# Routing and Queries Assignment - Advanced Notes API

This project extends the basic Notes Management API by implementing advanced routing parameters, query filters, pagination, and sorting capabilities.

## Advanced Features

### 1. Advanced Routing
- **Category-based Access**: `GET /category/:category`
- **Status-based Access**: `GET /status/:isPinned`
- **Summary**: `GET /:id/summary` - Provides a brief overview of a note.

### 2. Filtering (Query Parameters)
- **General Filter**: `GET /filter` - Filter notes based on various criteria.
- **Pinned Only**: `GET /filter/pinned` - Retrieve all pinned notes.
- **Specific Category**: `GET /filter/category?name=...`
- **Date Range**: `GET /filter/date-range?start=...&end=...`

### 3. Pagination & Sorting
- **Pagination**: `GET /paginate?page=1&limit=10`
- **Categorized Pagination**: `GET /paginate/category/:category?page=1&limit=5`
- **Sorting**: `GET /sort?sortBy=createdAt&order=desc`
- **Pinned Sorting**: `GET /sort/pinned?order=asc`

## Core CRUD
Includes all standard operations:
- `POST /`
- `GET /`
- `GET /:id`
- `PUT /:id`
- `PATCH /:id`
- `DELETE /:id`

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Features**: Advanced Querying, Pagination, Sorting

## Setup Instructions

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Environment Variables**:
    Configure your `.env` file with `MONGO_URI`.
3.  **Run the Server**:
    `npm run dev`

## Project Structure

- `src/middlewares`: Custom middleware for advanced query handling.
- `src/controllers`: Logic for complex filtering and pagination.
- `src/routes`: Comprehensive route mapping for queries and params.
