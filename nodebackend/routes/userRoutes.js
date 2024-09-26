const express = require("express");
const router = express.Router();
const { authenticateToken, isAdmin, isOwner } = require("../middleware/auth");
const { User, Address } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { JWT_SECRET } = process.env;

router.post("/login", async (req, res) => {
  try {
    const { email, password_hash } = req.body;

    if (!email || !password_hash) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(
      password_hash,
      user.password_hash
    );

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password_hash } = req.body;

    if (!name || !email || !password_hash) {
      return res
        .status(400)
        .json({ error: "Name, email, and password are required" });
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password_hash, 10);
    const newUser = await User.create({
      name,
      email,
      password_hash: hashedPassword,
    });

    res.status(201).json({ message: "User created" });
  } catch (error) {
    console.error(error);

    if (error.name === "SequelizeValidationError") {
      return res
        .status(400)
        .json({ error: error.errors.map((e) => e.message) });
    }

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
    // Check if all required fields are provided
    if (
      !data.street ||
      !data.city ||
      !data.state ||
      !data.zip_code ||
      !data.country
    ) {
      return res
        .status(400)
        .json({ message: "All address fields are required." });
    }

    // Optionally, check if the user already has the same address
    const existingAddress = await Address.findOne({
      where: {
        user_id: currentUser.id,
        street: data.street,
        city: data.city,
        state: data.state,
        zip_code: data.zip_code,
        country: data.country,
      },
    });

    if (existingAddress) {
      return res
        .status(400)
        .json({ message: "This address already exists for the user." });
    }

    // Create the new address
    const newAddress = await Address.create({
      user_id: currentUser.id,
      street: data.street,
      city: data.city,
      state: data.state,
      zip_code: data.zip_code,
      country: data.country,
    });

    return res
      .status(201)
      .json({ message: "Address added successfully", address: newAddress });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error adding address:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});

// Update a specific user address by ID
router.put("/user/address/:id", authenticateToken, async (req, res) => {
  const currentUser = req.user;
  const addressId = req.params.id;
  const data = req.body;

  try {
    const address = await Address.findOne({
      where: { user_id: currentUser.id, id: addressId },
    });

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    address.street = data.street || address.street;
    address.city = data.city || address.city;
    address.state = data.state || address.state;
    address.zip_code = data.zip_code || address.zip_code;
    address.country = data.country || address.country;

    await address.save();

    return res.json({ message: "Address updated successfully", address });
  } catch (error) {
    console.error("Error updating address:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get all addresses for the authenticated user
router.get("/user/addresses", authenticateToken, async (req, res) => {
  const currentUser = req.user;

  try {
    const addresses = await Address.findAll({
      where: { user_id: currentUser.id },
    });

    if (!addresses.length) {
      return res.status(404).json({ message: "No addresses found" });
    }

    return res.json({ addresses });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Delete an address by ID
router.delete("/user/address/:id", authenticateToken, async (req, res) => {
  const currentUser = req.user;
  const addressId = req.params.id;

  try {
    const address = await Address.findOne({
      where: { user_id: currentUser.id, id: addressId },
    });

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    await address.destroy();

    return res.json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error deleting address:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
