const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { JWT_SECRET } = process.env;

// Middleware to authenticate the token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findByPk(decoded.userId);
    if (!req.user) return res.status(404).json({ error: "User not found" });
    next();
  } catch (error) {
    return res.sendStatus(403); // Invalid token
  }
};

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.is_admin) {
    next();
  } else {
    return res.status(403).json({ error: "Admin access required" });
  }
};

// Middleware to check if the user is the owner
const isOwner = (req, res, next) => {
  if (req.user && req.user.is_owner) {
    next();
  } else {
    return res.status(403).json({ error: "Owner access required" });
  }
};

module.exports = {
  authenticateToken,
  isAdmin,
  isOwner,
};
