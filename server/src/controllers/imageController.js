const path = require("path");
const { Album, Image } = require("../db/models");
const { processImage, deleteImage } = require("../utils/imageProcessor");

// Получить все фотографии по альбомам
const getAllImagesByAlbums = async (req, res) => {
  try {
    const albums = await Album.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Image,
          as: "images",
          attributes: [
            "id",
            "filename",
            "originalName",
            "description",
            "width",
            "height",
            "uploadedAt",
          ],
          order: [["uploadedAt", "DESC"]],
        },
      ],
    });

    const result = albums.map((album) => ({
      album: {
        id: album.id,
        name: album.name,
        description: album.description,
        coverImageId: album.coverImageId,
        createdAt: album.createdAt,
      },
      images: album.images.map((img) => ({
        id: img.id,
        filename: img.filename,
        originalName: img.originalName,
        description: img.description,
        width: img.width,
        height: img.height,
        uploadedAt: img.uploadedAt,
        webUrl: `/api/images/web/${img.id}`,
        thumbnailUrl: `/api/images/thumbnail/${img.id}`,
      })),
    }));

    res.json(result);
  } catch (error) {
    console.error("Get all images error:", error);
    res.status(500).json({ error: "Failed to fetch images" });
  }
};

// Получить фотографии конкретного альбома
const getImagesByAlbum = async (req, res) => {
  try {
    const { albumId } = req.params;

    const images = await Image.findAll({
      where: { albumId },
      order: [["uploadedAt", "DESC"]],
      attributes: [
        "id",
        "filename",
        "originalName",
        "description",
        "width",
        "height",
        "uploadedAt",
      ],
    });

    const result = images.map((img) => ({
      id: img.id,
      filename: img.filename,
      originalName: img.originalName,
      description: img.description,
      width: img.width,
      height: img.height,
      uploadedAt: img.uploadedAt,
      webUrl: `/api/images/web/${img.id}`,
      thumbnailUrl: `/api/images/thumbnail/${img.id}`,
    }));

    res.json(result);
  } catch (error) {
    console.error("Get images by album error:", error);
    res.status(500).json({ error: "Failed to fetch images" });
  }
};

// Загрузить новую фотографию (только админ)
const uploadImage = async (req, res) => {
  try {
    const { albumId, description } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!albumId) {
      return res.status(400).json({ error: "Album ID is required" });
    }

    // Проверяем существование альбома
    const album = await Album.findByPk(albumId);
    if (!album) {
      return res.status(404).json({ error: "Album not found" });
    }

    // Обрабатываем изображение
    const uploadDir = process.env.UPLOAD_DIR || "uploads";
    const processed = await processImage(file.path, file.filename, uploadDir);

    // Сохраняем в БД
    const image = await Image.create({
      albumId,
      originalPath: processed.originalPath,
      webPath: processed.webPath,
      thumbnailPath: processed.thumbnailPath,
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: processed.metadata.size,
      width: processed.metadata.width,
      height: processed.metadata.height,
      description: description || null,
    });

    // Если это первая фотография, устанавливаем как обложку
    const imagesCount = await Image.count({ where: { albumId } });
    if (imagesCount === 1) {
      await album.update({ coverImageId: image.id });
    }

    res.status(201).json({
      id: image.id,
      webUrl: `/api/images/web/${image.id}`,
      thumbnailUrl: `/api/images/thumbnail/${image.id}`,
      message: "Image uploaded successfully",
    });
  } catch (error) {
    console.error("Upload image error:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
};

// Получить веб-версию (низкое качество)
const getWebImage = async (req, res) => {
  try {
    const { id } = req.params;

    const image = await Image.findByPk(id);
    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    res.sendFile(path.resolve(image.webPath));
  } catch (error) {
    console.error("Get web image error:", error);
    res.status(500).json({ error: "Failed to fetch image" });
  }
};

// Получить миниатюру
const getThumbnail = async (req, res) => {
  try {
    const { id } = req.params;

    const image = await Image.findByPk(id);
    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    res.sendFile(path.resolve(image.thumbnailPath));
  } catch (error) {
    console.error("Get thumbnail error:", error);
    res.status(500).json({ error: "Failed to fetch thumbnail" });
  }
};

// Получить оригинал (только админ!)
const getOriginalImage = async (req, res) => {
  try {
    const { id } = req.params;

    const image = await Image.findByPk(id);
    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    res.sendFile(path.resolve(image.originalPath));
  } catch (error) {
    console.error("Get original image error:", error);
    res.status(500).json({ error: "Failed to fetch original image" });
  }
};

// Удалить фотографию (только админ)
const deleteImageById = async (req, res) => {
  try {
    const { id } = req.params;

    const image = await Image.findByPk(id);
    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Удаляем физические файлы
    await deleteImage(image.originalPath, image.webPath, image.thumbnailPath);

    // Удаляем из БД
    await image.destroy();

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Delete image error:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
};

// Обновить описание (только админ)
const updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    const image = await Image.findByPk(id);
    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    await image.update({ description });

    res.json({
      id: image.id,
      description: image.description,
    });
  } catch (error) {
    console.error("Update image error:", error);
    res.status(500).json({ error: "Failed to update image" });
  }
};

module.exports = {
  getAllImagesByAlbums,
  getImagesByAlbum,
  uploadImage,
  getWebImage,
  getThumbnail,
  getOriginalImage,
  deleteImageById,
  updateImage,
};
