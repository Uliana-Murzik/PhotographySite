const express = require("express");
const {
  getAllAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
} = require("../controllers/albumController");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// Публичные маршруты
router.get("/", getAllAlbums);
router.get("/:id", getAlbumById);

// Защищенные маршруты (только админ)
router.post("/", authenticateToken, requireAdmin, createAlbum);
router.put("/:id", authenticateToken, requireAdmin, updateAlbum);
router.delete("/:id", authenticateToken, requireAdmin, deleteAlbum);

module.exports = router;
