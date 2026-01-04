import { Response } from "express";
import { query } from "../database/database";
import { AuthRequest } from "../middleware/auth";
import { processImage, deleteImage } from "../utils/imageProcessor";
import path from "path";

// Получить все фотографии по альбомам
export const getAllImagesByAlbums = async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(`
      SELECT 
        a.id as album_id,
        a.name as album_name,
        a.description as album_description,
        a.cover_image_id,
        a.created_at as album_created_at,
        json_agg(
          json_build_object(
            'id', i.id,
            'filename', i.filename,
            'originalName', i.original_name,
            'description', i.description,
            'width', i.width,
            'height', i.height,
            'uploadedAt', i.uploaded_at,
            'webUrl', '/api/images/web/' || i.id,
            'thumbnailUrl', '/api/images/thumbnail/' || i.id
          ) ORDER BY i.uploaded_at DESC
        ) FILTER (WHERE i.id IS NOT NULL) as images
      FROM albums a
      LEFT JOIN images i ON i.album_id = a.id
      GROUP BY a.id
      ORDER BY a.created_at DESC
    `);

    const albums = result.rows.map((row: any) => ({
      album: {
        id: row.album_id,
        name: row.album_name,
        description: row.album_description,
        coverImageId: row.cover_image_id,
        createdAt: row.album_created_at,
      },
      images: row.images || [],
    }));

    res.json(albums);
  } catch (error) {
    console.error("Get all images error:", error);
    res.status(500).json({ error: "Failed to fetch images" });
  }
};

// Получить фотографии конкретного альбома
export const getImagesByAlbum = async (req: AuthRequest, res: Response) => {
  try {
    const { albumId } = req.params;

    const result = await query(
      `SELECT 
        id, filename, original_name, description, 
        width, height, uploaded_at
       FROM images
       WHERE album_id = $1
       ORDER BY uploaded_at DESC`,
      [albumId]
    );

    const images = result.rows.map((img: any) => ({
      id: img.id,
      filename: img.filename,
      originalName: img.original_name,
      description: img.description,
      width: img.width,
      height: img.height,
      uploadedAt: img.uploaded_at,
      webUrl: `/api/images/web/${img.id}`,
      thumbnailUrl: `/api/images/thumbnail/${img.id}`,
    }));

    res.json(images);
  } catch (error) {
    console.error("Get images by album error:", error);
    res.status(500).json({ error: "Failed to fetch images" });
  }
};

// Загрузить новую фотографию (только админ)
export const uploadImage = async (req: AuthRequest, res: Response) => {
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
    const albumCheck = await query("SELECT id FROM albums WHERE id = $1", [
      albumId,
    ]);

    if (albumCheck.rows.length === 0) {
      return res.status(404).json({ error: "Album not found" });
    }

    // Обрабатываем изображение
    const uploadDir = process.env.UPLOAD_DIR || "uploads";
    const processed = await processImage(file.path, file.filename, uploadDir);

    // Сохраняем в БД
    const result = await query(
      `INSERT INTO images (
        album_id, original_path, web_path, thumbnail_path,
        filename, original_name, mime_type, size,
        width, height, description
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id`,
      [
        albumId,
        processed.originalPath,
        processed.webPath,
        processed.thumbnailPath,
        file.filename,
        file.originalname,
        file.mimetype,
        processed.metadata.size,
        processed.metadata.width,
        processed.metadata.height,
        description || null,
      ]
    );

    const imageId = result.rows[0].id;

    // Если это первая фотография, устанавливаем как обложку
    const imagesCount = await query(
      "SELECT COUNT(*) as count FROM images WHERE album_id = $1",
      [albumId]
    );

    if (parseInt(imagesCount.rows[0].count) === 1) {
      await query("UPDATE albums SET cover_image_id = $1 WHERE id = $2", [
        imageId,
        albumId,
      ]);
    }

    res.status(201).json({
      id: imageId,
      webUrl: `/api/images/web/${imageId}`,
      thumbnailUrl: `/api/images/thumbnail/${imageId}`,
      message: "Image uploaded successfully",
    });
  } catch (error) {
    console.error("Upload image error:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
};

// Получить веб-версию (низкое качество)
export const getWebImage = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query("SELECT web_path FROM images WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Image not found" });
    }

    res.sendFile(path.resolve(result.rows[0].web_path));
  } catch (error) {
    console.error("Get web image error:", error);
    res.status(500).json({ error: "Failed to fetch image" });
  }
};

// Получить миниатюру
export const getThumbnail = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query(
      "SELECT thumbnail_path FROM images WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Image not found" });
    }

    res.sendFile(path.resolve(result.rows[0].thumbnail_path));
  } catch (error) {
    console.error("Get thumbnail error:", error);
    res.status(500).json({ error: "Failed to fetch thumbnail" });
  }
};

// Получить оригинал (только админ!)
export const getOriginalImage = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query(
      "SELECT original_path FROM images WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Image not found" });
    }

    res.sendFile(path.resolve(result.rows[0].original_path));
  } catch (error) {
    console.error("Get original image error:", error);
    res.status(500).json({ error: "Failed to fetch original image" });
  }
};

// Удалить фотографию (только админ)
export const deleteImageById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query(
      "SELECT original_path, web_path, thumbnail_path FROM images WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Image not found" });
    }

    const image = result.rows[0];

    // Удаляем физические файлы
    await deleteImage(
      image.original_path,
      image.web_path,
      image.thumbnail_path
    );

    // Удаляем из БД
    await query("DELETE FROM images WHERE id = $1", [id]);

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Delete image error:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
};

// Обновить описание (только админ)
export const updateImage = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    const result = await query(
      `UPDATE images
       SET description = $1
       WHERE id = $2
       RETURNING id, description`,
      [description, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Image not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update image error:", error);
    res.status(500).json({ error: "Failed to update image" });
  }
};
