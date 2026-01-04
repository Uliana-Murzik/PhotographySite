const jwt = require("jsonwebtoken");
const { User } = require("../db/models");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

    // Проверяем что пользователь еще существует
    const user = await User.findByPk(decoded.userId, {
      attributes: ["id", "login", "isAdmin"],
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = {
      id: user.id,
      login: user.login,
      isAdmin: user.isAdmin,
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({ error: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ error: "Token expired" });
    }

    console.error("Auth middleware error:", error);
    return res.status(500).json({ error: "Authentication failed" });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res
      .status(403)
      .json({ error: "Access denied. Admin privileges required" });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
};
