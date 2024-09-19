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

// Get user account information
router.get("/user/account", authenticateToken, async (req, res) => {
  const currentUser = req.user;

  try {
    const user = await User.findByPk(currentUser.id);

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
});

// Update user account information
router.put("/user/account", authenticateToken, async (req, res) => {
  const currentUser = req.user;
  const data = req.body;

  try {
    const user = await User.findByPk(currentUser.id);

    user.name = data.name || user.name;
    user.email = data.email || user.email;

    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      user.password_hash = await bcrypt.hash(data.password, salt);
    }

    await user.save();

    return res.json({ message: "Account updated successfully" });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
});

// Add user address
router.post("/user/address", authenticateToken, async (req, res) => {
  const currentUser = req.user;
  const data = req.body;

  try {
    const existingAddress = await Address.findOne({
      where: { user_id: currentUser.id },
    });

    if (existingAddress) {
      return res
        .status(400)
        .json({ message: "Address already exists. Use PUT to update." });
    }

    await Address.create({
      user_id: currentUser.id,
      street: data.street,
      city: data.city,
      state: data.state,
      zip_code: data.zip_code,
      country: data.country,
    });

    return res.status(201).json({ message: "Address added successfully" });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
});

// Update user address
router.put("/user/address", authenticateToken, async (req, res) => {
  const currentUser = req.user;
  const data = req.body;

  try {
    const address = await Address.findOne({
      where: { user_id: currentUser.id },
    });

    if (!address) {
      return res
        .status(404)
        .json({ message: "Address not found. Use POST to add." });
    }

    address.street = data.street || address.street;
    address.city = data.city || address.city;
    address.state = data.state || address.state;
    address.zip_code = data.zip_code || address.zip_code;
    address.country = data.country || address.country;

    await address.save();

    return res.json({ message: "Address updated successfully" });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
