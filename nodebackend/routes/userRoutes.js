const express = require("express");
const router = express.Router();
const { authenticateToken, isAdmin, isOwner } = require("../middleware/auth");
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { JWT_SECRET } = process.env;

router.post("/login", async (req, res) => {
  try {
    const { email, password_hash } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password_hash, user.password_hash))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password_hash } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password_hash, 10);
    const newUser = await User.create({
      name,
      email,
      password_hash: hashedPassword,
    });
    res.status(201).json({ message: "User created" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
