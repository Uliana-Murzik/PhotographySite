const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../db/models");

// Регистрация (для создания админа)
const register = async (req, res) => {
  try {
    const { login, password, isAdmin } = req.body;

    if (!login || !password) {
      return res.status(400).json({ error: "Login and password are required" });
    }

    // Проверка существования пользователя
    const existingUser = await User.findOne({ where: { login } });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Хешируем пароль
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Создаем пользователя
    const user = await User.create({
      login,
      passwordHash,
      isAdmin: isAdmin || false,
    });

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      }
    );

    res.status(201).json({
      message: "User successfully registered",
      user: {
        id: user.id,
        login: user.login,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
};

// Вход
const login = async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({ error: "Login and password are required" });
    }

    // Найти пользователя
    const user = await User.findOne({ where: { login } });
    if (!user) {
      return res.status(401).json({ error: "Invalid login or password" });
    }

    // Проверяем пароль
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid login or password" });
    }

    // Генерируем токен
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      }
    );

    res.json({
      message: "Successfully logged in",
      user: {
        id: user.id,
        login: user.login,
        isAdmin: user.isAdmin,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

// Проверка токена
const verifyToken = async (req, res) => {
  res.json({ message: "Token is valid", user: req.user });
};

module.exports = {
  register,
  login,
  verifyToken,
};
