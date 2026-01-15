const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const { sequelize } = require("./db/models");
const authRoutes = require("./routes/auth");
const albumRoutes = require("./routes/albums");
const imageRoutes = require("./routes/images");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5001;

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:4173"],
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 минут
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 100 запросов
});
app.use(limiter);

// Logging
app.use(morgan("combined"));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Создание директорий для загрузок
const createUploadDirectories = async () => {
  const uploadDir = process.env.UPLOAD_DIR || "uploads";
  const dirs = [
    path.join(uploadDir, "temp"),
    path.join(uploadDir, "originals"),
    path.join(uploadDir, "web"),
    path.join(uploadDir, "thumbnails"),
  ];

  for (const dir of dirs) {
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (error) {
      console.error(`Error creating directory ${dir}:`, error);
    }
  }
};

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Photography Backend is running",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/images", imageRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(err.status || 500).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Something went wrong!"
        : err.message,
  });
});

// Запуск сервера
const startServer = async () => {
  try {
    // Подключение к PostgreSQL через Sequelize
    await sequelize.authenticate();
    console.log("✅ Connected to PostgreSQL database (Sequelize)");

    // Создание директорий
    await createUploadDirectories();
    console.log("✅ Upload directories created");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(
        `📸 Photography Backend started in ${
          process.env.NODE_ENV || "development"
        } mode`
      );
      console.log(
        `📁 Upload directory: ${process.env.UPLOAD_DIR || "uploads"}`
      );
      console.log(`💾 Using Sequelize ORM with PostgreSQL`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
