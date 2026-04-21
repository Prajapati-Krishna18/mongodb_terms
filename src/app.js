const express = require("express");
const noteRoutes = require("./routes/note.routes");

const app = express();

app.use(express.json());

app.use("/api/notes", noteRoutes);

// Global error handler
app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: err.message,
    data: null,
  });
});

module.exports = app;
