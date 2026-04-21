const express = require("express");
const router = express.Router();
const {
  createNote,
  createBulkNotes,
  getAllNotes,
} = require("../controllers/note.controller");

// CRUD
router.post("/bulk", createBulkNotes);
router.post("/", createNote);
router.get("/", getAllNotes);

module.exports = router;
