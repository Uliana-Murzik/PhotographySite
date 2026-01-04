const express = require("express");
const {
  register,
  login,
  verifyToken,
} = require("../controllers/authController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Регистрация (можно отключить после создания админа)
router.post("/register", register);

// Вход
router.post("/login", login);

// Проверка токена
router.get("/verify", authenticateToken, verifyToken);

module.exports = router;
