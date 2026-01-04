const express = require("express");
const {
  getAllImagesByAlbums,
  getImagesByAlbum,
  uploadImage,
  getWebImage,
  getThumbnail,
  getOriginalImage,
  deleteImageById,
  updateImage,
} = require("../controllers/imageController");
const { authenticateToken, requireAdmin } = require("../middleware/auth");
const { upload } = require("../middleware/upload");

const router = express.Router();

// Публичные маршруты
router.get("/all", getAllImagesByAlbums);
router.get("/album/:albumId", getImagesByAlbum);
router.get("/web/:id", getWebImage);
router.get("/thumbnail/:id", getThumbnail);

// Защищенные маршруты (только админ)
router.post(
  "/upload",
  authenticateToken,
  requireAdmin,
  upload.single("image"),
  uploadImage
);
router.get("/original/:id", authenticateToken, requireAdmin, getOriginalImage);
router.put("/:id", authenticateToken, requireAdmin, updateImage);
router.delete("/:id", authenticateToken, requireAdmin, deleteImageById);

module.exports = router;
