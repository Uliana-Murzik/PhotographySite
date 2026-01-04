const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// Временное хранилище для загружаемых файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/temp"); // Временная папка
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// Фильтр для проверки типа файла
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Неподдерживаемый формат файла. Разрешены только: JPEG, PNG, WebP"
      )
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // Максимум 50MB для оригинала
  },
});

module.exports = { upload };
