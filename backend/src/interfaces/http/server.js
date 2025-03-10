const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("../../config/database");
const userRoutes = require("./routes/userRoutes");
const noteRoutes = require("./routes/noteRoutes");

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", userRoutes);
app.use("/api/notes", noteRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`iNotebook backend listening at http://localhost:${PORT}`);
});
