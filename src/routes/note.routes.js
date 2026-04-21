const express = require("express");
const router = express.Router();
const { createNote, createBulkNotes } = require("../controllers/note.controller");

// CRUD
router.post("/bulk", createBulkNotes);
router.post("/", createNote);

module.exports = router;
