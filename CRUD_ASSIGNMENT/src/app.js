const express = require("express");
const dotenv = require("dotenv");
const noteRoutes = require("./routes/note.routes");

dotenv.config();

const app = express();

app.use(express.json());

// Routes
app.use("/api/notes", noteRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Notes Management API is running...");
});

// Error handling middleware (basic)
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    data: null,
  });
});

module.exports = app;
