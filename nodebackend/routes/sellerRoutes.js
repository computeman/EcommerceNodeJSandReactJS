const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { JWT_SECRET } = process.env;
const router = express.Router();

router.post("/seller/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ message: "Invalid seller credentials" });
    }
    const role = "seller";

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "24h",
    });
    res.json({ token, role });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
