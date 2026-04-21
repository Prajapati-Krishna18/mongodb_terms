# CRUD Assignment - Notes Management API

A professional-grade REST API for managing notes, built with Node.js, Express, and MongoDB. This project focuses on implementing robust CRUD (Create, Read, Update, Delete) operations and bulk management.

## Features

- **Standard CRUD**:
  - `POST /`: Create a new note.
  - `GET /`: Retrieve all notes.
  - `GET /:id`: Retrieve a specific note by its ID.
  - `PUT /:id`: Replace an entire note.
  - `PATCH /:id`: Partially update a note.
  - `DELETE /:id`: Delete a specific note.

- **Bulk Operations**:
  - `POST /bulk`: Create multiple notes at once.
  - `DELETE /bulk`: Delete multiple notes in a single request.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Environment Management**: dotenv
- **Development**: nodemon

## Setup Instructions

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Environment Variables**:
    Create a `.env` file in the root directory and add your MongoDB connection string:
    ```env
    PORT=3000
    MONGO_URI=your_mongodb_uri
    ```
3.  **Run the Server**:
    - Development mode: `npm run dev`
    - Production mode: `npm start`

## Folder Structure

- `src/config`: Database connection setup.
- `src/controllers`: Request handling logic.
- `src/models`: Mongoose schemas and models.
- `src/routes`: API route definitions.
- `src/index.js`: Main entry point.
