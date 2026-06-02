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

// Helper for validating note IDs
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

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

    if (!isValidId(id)) {
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

    if (!isValidId(id)) {
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

    if (!isValidId(id)) {
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

    if (!isValidId(id)) {
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

    const invalidId = ids.find(id => !isValidId(id));
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

// 9. GET /api/notes/search — Search in title only
const searchByTitle = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query 'q' is required",
        data: null,
      });
    }

    const notes = await Note.find({
      title: { $regex: q, $options: "i" },
    });

    res.status(200).json({
      success: true,
      message: `Search results for: ${q}`,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// 10. GET /api/notes/search/content — Search in content only
const searchByContent = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query 'q' is required",
        data: null,
      });
    }

    const notes = await Note.find({
      content: { $regex: q, $options: "i" },
    });

    res.status(200).json({
      success: true,
      message: `Content search results for: ${q}`,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// 11. GET /api/notes/search/all — Search in title AND content
const searchAll = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query 'q' is required",
        data: null,
      });
    }

    const notes = await Note.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
      ],
    });

    res.status(200).json({
      success: true,
      message: `Search results for: ${q}`,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Helper function to build dynamic filters
const buildFilter = (query) => {
  const filter = {};
  if (query.category) filter.category = query.category;
  if (query.isPinned !== undefined) {
    filter.isPinned = query.isPinned === "true";
  }
  return filter;
};

// Helper function to handle sorting
const buildSort = (query) => {
  const allowed = ["title", "createdAt", "updatedAt", "category"];
  const sortBy = allowed.includes(query.sortBy) ? query.sortBy : "createdAt";
  const order = query.order === "asc" ? 1 : -1;
  return { sortBy, sortObj: { [sortBy]: order } };
};

// Helper to validate sortBy query parameter if it exists
const validateSortBy = (sortBy) => {
  if (sortBy) {
    const allowed = ["title", "createdAt", "updatedAt", "category"];
    if (!allowed.includes(sortBy)) {
      return false;
    }
  }
  return true;
};

// 12. GET /api/notes/filter-sort — Filter + Sort
const filterAndSort = async (req, res) => {
  try {
    if (!validateSortBy(req.query.sortBy)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sortBy. Allowed: title, createdAt, updatedAt, category",
        data: null,
      });
    }

    const filter = buildFilter(req.query);
    const { sortObj } = buildSort(req.query);

    const notes = await Note.find(filter).sort(sortObj);

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

// 13. GET /api/notes/filter-paginate — Filter + Paginate
const filterAndPaginate = async (req, res) => {
  try {
    const filter = buildFilter(req.query);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Note.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    const notes = await Note.find(filter).skip(skip).limit(limit);

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

// 14. GET /api/notes/sort-paginate — Sort + Paginate
const sortAndPaginate = async (req, res) => {
  try {
    if (!validateSortBy(req.query.sortBy)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sortBy. Allowed: title, createdAt, updatedAt, category",
        data: null,
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { sortObj } = buildSort(req.query);

    const total = await Note.countDocuments();
    const totalPages = Math.ceil(total / limit);
    const notes = await Note.find().sort(sortObj).skip(skip).limit(limit);

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

// 15. GET /api/notes/search-filter — Search + Filter
const searchAndFilter = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query 'q' is required",
        data: null,
      });
    }

    const filter = buildFilter(req.query);
    filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { content: { $regex: q, $options: "i" } },
    ];

    const notes = await Note.find(filter);

    res.status(200).json({
      success: true,
      message: `Search results for: ${q}`,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// 16. GET /api/notes/search-sort-paginate — Search + Sort + Paginate
const searchSortPaginate = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query 'q' is required",
        data: null,
      });
    }

    if (!validateSortBy(req.query.sortBy)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sortBy. Allowed: title, createdAt, updatedAt, category",
        data: null,
      });
    }

    const filter = {
      $or: [
        { title: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
      ],
    };

    const { sortObj } = buildSort(req.query);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Note.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    const notes = await Note.find(filter).sort(sortObj).skip(skip).limit(limit);

    res.status(200).json({
      success: true,
      message: `Search results for: ${q}`,
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

// 17. GET /api/notes/filter-sort-paginate — Filter + Sort + Paginate
const filterSortPaginate = async (req, res) => {
  try {
    if (!validateSortBy(req.query.sortBy)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sortBy. Allowed: title, createdAt, updatedAt, category",
        data: null,
      });
    }

    const filter = buildFilter(req.query);
    const { sortObj } = buildSort(req.query);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Note.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    const notes = await Note.find(filter).sort(sortObj).skip(skip).limit(limit);

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

// 18. GET /api/notes/query — Everything at once (Master endpoint)
const masterQuery = async (req, res) => {
  try {
    const { q, category, isPinned, sortBy, order, page, limit } = req.query;

    if (!validateSortBy(sortBy)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sortBy. Allowed: title, createdAt, updatedAt, category",
        data: null,
      });
    }

    const filter = {};

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
      ];
    }
    if (category) filter.category = category;
    if (isPinned !== undefined) filter.isPinned = isPinned === "true";

    const allowedSortFields = ["title", "createdAt", "updatedAt", "category"];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await Note.countDocuments(filter);
    const notes = await Note.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      data: notes,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    handleError(res, error);
  }
};

// GET /api/notes/:id/summary — Get summary
const getNoteSummary = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
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

module.exports = {
  createNote,
  createBulkNotes,
  getAllNotes,
  getNoteById,
  replaceNote,
  updateNote,
  deleteNote,
  deleteBulkNotes,
  searchByTitle,
  searchByContent,
  searchAll,
  filterAndSort,
  filterAndPaginate,
  sortAndPaginate,
  searchAndFilter,
  searchSortPaginate,
  filterSortPaginate,
  masterQuery,
  getNoteSummary,
};
