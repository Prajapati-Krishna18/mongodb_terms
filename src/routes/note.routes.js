const express = require("express");
const router = express.Router();
const {
  createNote,
  createBulkNotes,
  getAllNotes,
  getNoteById,
} = require("../controllers/note.controller");

// CRUD
router.post("/bulk", createBulkNotes);
router.post("/", createNote);
router.get("/", getAllNotes);
router.get("/:id", getNoteById);

module.exports = router;
