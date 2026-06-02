const express = require("express");
const noteRoutes = require("./routes/note.routes");

const app = express();

app.use(express.json());

// Routes
app.use("/api/notes", noteRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Search and Combined Queries API is running...");
});

// Global error handler
app.use((err, req, res, next) => {
  let statusCode = err.status || err.statusCode || 500;
  
  if (err.name === "ValidationError" || err.name === "CastError") {
    statusCode = 400;
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    data: null,
  });
});

module.exports = app;
