const { Album, Image } = require("../db/models");

// Получить все альбомы
const getAllAlbums = async (req, res) => {
  try {
    const albums = await Album.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Image,
          as: "images",
          attributes: ["id"],
        },
      ],
    });

    res.json(albums);
  } catch (error) {
    console.error("Get albums error:", error);
    res.status(500).json({ error: "Failed to fetch albums" });
  }
};

// Получить альбом по ID
const getAlbumById = async (req, res) => {
  try {
    const { id } = req.params;

    const album = await Album.findByPk(id, {
      include: [
        {
          model: Image,
          as: "images",
          order: [["uploadedAt", "DESC"]],
        },
      ],
    });

    if (!album) {
      return res.status(404).json({ error: "Album not found" });
    }

    res.json(album);
  } catch (error) {
    console.error("Get album error:", error);
    res.status(500).json({ error: "Failed to fetch album" });
  }
};

// Создать новый альбом (только админ)
const createAlbum = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Album name is required" });
    }

    const album = await Album.create({
      name,
      description,
    });

    res.status(201).json(album);
  } catch (error) {
    console.error("Create album error:", error);
    res.status(500).json({ error: "Failed to create album" });
  }
};

// Обновить альбом (только админ)
const updateAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, coverImageId } = req.body;

    const album = await Album.findByPk(id);
    if (!album) {
      return res.status(404).json({ error: "Album not found" });
    }

    await album.update({
      name: name || album.name,
      description: description !== undefined ? description : album.description,
      coverImageId:
        coverImageId !== undefined ? coverImageId : album.coverImageId,
    });

    res.json(album);
  } catch (error) {
    console.error("Update album error:", error);
    res.status(500).json({ error: "Failed to update album" });
  }
};

// Удалить альбом (только админ)
const deleteAlbum = async (req, res) => {
  try {
    const { id } = req.params;

    const album = await Album.findByPk(id);
    if (!album) {
      return res.status(404).json({ error: "Album not found" });
    }

    await album.destroy(); // Cascade удалит все изображения

    res.json({ message: "Album and all images deleted successfully" });
  } catch (error) {
    console.error("Delete album error:", error);
    res.status(500).json({ error: "Failed to delete album" });
  }
};

module.exports = {
  getAllAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
};
