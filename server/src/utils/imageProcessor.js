const sharp = require("sharp");
const path = require("path");
const fs = require("fs").promises;

// Настройки для веб-версий (низкое качество для защиты)
const WEB_IMAGE_CONFIG = {
  maxWidth: 1200, // Максимальная ширина
  maxHeight: 1200, // Максимальная высота
  quality: 60, // Низкое качество (60%)
  format: "jpeg",
};

// Настройки для миниатюр
const THUMBNAIL_CONFIG = {
  width: 300,
  height: 300,
  quality: 70,
  format: "jpeg",
  fit: "cover",
};

/**
 * Обрабатывает загруженное изображение:
 * - Сохраняет оригинал (только для админа)
 * - Создает веб-версию с низким качеством (для просмотра)
 * - Создает миниатюру
 */
async function processImage(inputPath, filename, uploadDir) {
  const originalDir = path.join(uploadDir, "originals");
  const webDir = path.join(uploadDir, "web");
  const thumbnailDir = path.join(uploadDir, "thumbnails");

  // Создаем директории если их нет
  await Promise.all([
    fs.mkdir(originalDir, { recursive: true }),
    fs.mkdir(webDir, { recursive: true }),
    fs.mkdir(thumbnailDir, { recursive: true }),
  ]);

  const nameWithoutExt = path.parse(filename).name;

  // Пути к файлам
  const originalPath = path.join(originalDir, filename);
  const webPath = path.join(webDir, `${nameWithoutExt}.jpg`);
  const thumbnailPath = path.join(thumbnailDir, `${nameWithoutExt}.jpg`);

  // Читаем оригинальное изображение
  const image = sharp(inputPath);
  const metadata = await image.metadata();

  // Сохраняем оригинал
  await fs.copyFile(inputPath, originalPath);

  // Создаем веб-версию с НИЗКИМ качеством и размером
  await image
    .clone()
    .resize(WEB_IMAGE_CONFIG.maxWidth, WEB_IMAGE_CONFIG.maxHeight, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: WEB_IMAGE_CONFIG.quality })
    .toFile(webPath);

  // Создаем миниатюру
  await image
    .clone()
    .resize(THUMBNAIL_CONFIG.width, THUMBNAIL_CONFIG.height, {
      fit: THUMBNAIL_CONFIG.fit,
    })
    .jpeg({ quality: THUMBNAIL_CONFIG.quality })
    .toFile(thumbnailPath);

  // Удаляем временный файл
  await fs.unlink(inputPath);

  const stats = await fs.stat(originalPath);

  return {
    originalPath,
    webPath,
    thumbnailPath,
    metadata: {
      width: metadata.width || 0,
      height: metadata.height || 0,
      size: stats.size,
    },
  };
}

/**
 * Удаляет все версии изображения
 */
async function deleteImage(originalPath, webPath, thumbnailPath) {
  await Promise.all([
    fs.unlink(originalPath).catch(() => {}),
    fs.unlink(webPath).catch(() => {}),
    fs.unlink(thumbnailPath).catch(() => {}),
  ]);
}

module.exports = {
  processImage,
  deleteImage,
};
