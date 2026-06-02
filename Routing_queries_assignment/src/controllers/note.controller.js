const mongoose = require("mongoose");
const Note = require("../models/note.model");

// Helper function to send standard error responses
const handleError = (res, error) => {
  const statusCode = error.name === "ValidationError" || error.name === "CastError" ? 400 : 500;
  res.status(statusCode).json({
    success: false,
    message: error.message,
    data: null,
  });
};

// 1. POST /api/notes — Create a note
const createNote = async (req, res) => {
  try {
    const { title, content, category, isPinned } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
        data: null,
      });
    }

    const note = await Note.create({
      title,
      content,
      category,
      isPinned,
    });

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      data: note,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// 2. POST /api/notes/bulk — Create multiple notes
const createBulkNotes = async (req, res) => {
  try {
    const { notes } = req.body;

    if (!notes || !Array.isArray(notes) || notes.length === 0) {
      return res.status(400).json({
        success: false,
        message: "notes array is required and cannot be empty",
        data: null,
      });
    }

    const createdNotes = await Note.insertMany(notes);

    res.status(201).json({
      success: true,
      message: `${createdNotes.length} notes created successfully`,
      data: createdNotes,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// 3. GET /api/notes — Get all notes
const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find();
    res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// 4. GET /api/notes/:id — Get note by ID
const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID",
        data: null,
      });
    }

    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Note fetched successfully",
      data: note,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// 5. PUT /api/notes/:id — Full replace
const replaceNote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID",
        data: null,
      });
    }

    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
        data: null,
      });
    }

    const note = await Note.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
      overwrite: true,
      runValidators: true,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Note replaced successfully",
      data: note,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// 6. PATCH /api/notes/:id — Partial update
const updateNote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID",
        data: null,
      });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided to update",
        data: null,
      });
    }

    const note = await Note.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: note,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// 7. DELETE /api/notes/:id — Delete single
const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID",
        data: null,
      });
    }

    const note = await Note.findByIdAndDelete(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
      data: null,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// 8. DELETE /api/notes/bulk — Delete multiple
const deleteBulkNotes = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "ids array is required and cannot be empty",
        data: null,
      });
    }

    const invalidId = ids.find(id => !mongoose.Types.ObjectId.isValid(id));
    if (invalidId) {
      return res.status(400).json({
        success: false,
        message: "One or more note IDs are invalid",
        data: null,
      });
    }

    const result = await Note.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} notes deleted successfully`,
      data: null,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// 9. GET /api/notes/category/:category — Get by category
const getNotesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const allowed = ["work", "personal", "study"];

    if (!allowed.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category. Allowed: work, personal, study",
        data: null,
      });
    }

    const notes = await Note.find({ category });

    if (notes.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No notes found for category: ${category}`,
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: `Notes fetched for category: ${category}`,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// 10. GET /api/notes/status/:isPinned — Get by pinned status
const getNotesByStatus = async (req, res) => {
  try {
    const { isPinned } = req.params;

    if (isPinned !== "true" && isPinned !== "false") {
      return res.status(400).json({
        success: false,
        message: "isPinned must be true or false",
        data: null,
      });
    }

    const pinned = isPinned === "true";
    const notes = await Note.find({ isPinned: pinned });

    res.status(200).json({
      success: true,
      message: pinned ? "Fetched all pinned notes" : "Fetched all unpinned notes",
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// 11. GET /api/notes/:id/summary — Get note summary
const getNoteSummary = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID",
        data: null,
      });
    }

    const note = await Note.findById(id).select("title category isPinned createdAt");

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Note summary fetched successfully",
      data: note,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// 12. GET /api/notes/filter — General filter
const filterNotes = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.isPinned !== undefined) {
      filter.isPinned = req.query.isPinned === "true";
    }

    const notes = await Note.find(filter);

    res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// 13. GET /api/notes/filter/pinned — Get pinned notes
const getPinnedNotes = async (req, res) => {
  try {
    const filter = { isPinned: true };
    if (req.query.category) filter.category = req.query.category;

    const notes = await Note.find(filter);

    res.status(200).json({
      success: true,
      message: "Pinned notes fetched successfully",
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// 14. GET /api/notes/filter/category — Filter by category (query param)
const filterByCategory = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Query param 'name' is required",
        data: null,
      });
    }

    const notes = await Note.find({ category: name });

    res.status(200).json({
      success: true,
      message: `Notes filtered by category: ${name}`,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// 15. GET /api/notes/filter/date-range — Filter by date range
const filterByDateRange = async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: "Both 'from' and 'to' query params are required",
        data: null,
      });
    }

    const filter = {
      createdAt: {
        $gte: new Date(from),
        $lte: new Date(to),
      },
    };

    const notes = await Note.find(filter);

    res.status(200).json({
      success: true,
      message: `Notes fetched between ${from} and ${to}`,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// 16. GET /api/notes/paginate — Paginate all notes
const paginateNotes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Note.countDocuments();
    const totalPages = Math.ceil(total / limit);
    const notes = await Note.find().skip(skip).limit(limit);

    res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      data: notes,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    handleError(res, error);
  }
};

// 17. GET /api/notes/paginate/category/:category — Paginate by category
const paginateByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { category };
    const total = await Note.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    const notes = await Note.find(filter).skip(skip).limit(limit);

    res.status(200).json({
      success: true,
      message: `Notes fetched for category: ${category}`,
      data: notes,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    handleError(res, error);
  }
};

// 18. GET /api/notes/sort — Sort all notes
const sortNotes = async (req, res) => {
  try {
    const allowed = ["title", "createdAt", "updatedAt", "category"];
    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;

    if (!allowed.includes(sortBy)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sortBy. Allowed: title, createdAt, updatedAt, category",
        data: null,
      });
    }

    const notes = await Note.find().sort({ [sortBy]: order });

    res.status(200).json({
      success: true,
      message: `Notes sorted by ${sortBy} in ${
        req.query.order === "asc" ? "ascending" : "descending"
      } order`,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// 19. GET /api/notes/sort/pinned — Sort pinned notes only
const sortPinnedNotes = async (req, res) => {
  try {
    const allowed = ["title", "createdAt", "updatedAt", "category"];
    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;

    if (!allowed.includes(sortBy)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sortBy. Allowed: title, createdAt, updatedAt, category",
        data: null,
      });
    }

    const notes = await Note.find({ isPinned: true }).sort({ [sortBy]: order });

    res.status(200).json({
      success: true,
      message: `Pinned notes sorted by ${sortBy} in ${
        req.query.order === "asc" ? "ascending" : "descending"
      } order`,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  createNote,
  createBulkNotes,
  getAllNotes,
  getNoteById,
  replaceNote,
  updateNote,
  deleteNote,
  deleteBulkNotes,
  getNotesByCategory,
  getNotesByStatus,
  getNoteSummary,
  filterNotes,
  getPinnedNotes,
  filterByCategory,
  filterByDateRange,
  paginateNotes,
  paginateByCategory,
  sortNotes,
  sortPinnedNotes,
};
