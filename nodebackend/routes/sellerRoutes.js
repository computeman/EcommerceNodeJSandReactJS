const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Product, OrderItem, Order, User, Discount } = require("../models");
const { authenticateToken } = require("../middleware/auth");
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

router.get("/seller/products", authenticateToken, async (req, res) => {
  try {
    // Get the current user from the token
    const currentUser = req.user; // Assuming authenticateToken sets req.user
    const user = await User.findByPk(currentUser.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(user);

    // Check if the user is an admin
    if (!user.is_admin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    // Fetch products created by this user
    const products = await Product.findAll({
      where: { user_id: user.id },
    });

    // Return products in a formatted JSON response
    const productList = products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
    }));

    return res.json(productList);
  } catch (error) {
    console.error("Error fetching seller products:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
// Route to add a new product by the seller
router.post("/seller/product/add", authenticateToken, async (req, res) => {
  try {
    // Get the current user from the token
    const current_user = req.user; // Assuming authenticateToken sets req.user
    const user = await User.findByPk(current_user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is an admin
    if (!user.is_admin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    // Extract product data from the request body
    const {
      name,
      description,
      price,
      category,
      stock = 0,
      image_url,
    } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        message:
          "Missing required fields: name, description, price, and category",
      });
    }

    // Create a new product
    const new_product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      image_url,
      user_id: user.id,
    });

    return res.status(201).json({
      message: "Product added successfully",
      product_id: new_product.id,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Edit product
router.put(
  "/seller/product/edit/:product_id",
  authenticateToken,
  async (req, res) => {
    try {
      const { product_id } = req.params;
      const current_user = req.user; // assuming req.user is populated by authenticateToken middleware

      const user = await User.findByPk(current_user.id);
      if (!user || !user.is_admin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const product = await Product.findByPk(product_id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const { name, description, price, category, stock, image_url } = req.body;

      // Update product fields with new values or keep existing ones
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.category = category || product.category;
      product.stock = stock || product.stock;
      product.image_url = image_url || product.image_url;

      await product.save();

      return res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
      console.error("Error updating product:", error);
      return res
        .status(500)
        .json({ message: "An error occurred while updating the product" });
    }
  }
);

// Delete product
router.delete(
  "/seller/product/delete/:product_id",
  authenticateToken,
  async (req, res) => {
    try {
      const { product_id } = req.params;
      const current_user = req.user; // assuming req.user is populated by authenticateToken middleware

      const user = await User.findByPk(current_user.id);
      if (!user || !user.is_admin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const product = await Product.findByPk(product_id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Delete associated discounts
      await Discount.destroy({ where: { product_id: product.id } });

      // Delete the product
      await product.destroy();

      return res.status(200).json({
        message: "Product and associated discounts deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      return res
        .status(500)
        .json({ message: "An error occurred while deleting the product" });
    }
  }
);

router.get("/seller/orders", authenticateToken, async (req, res) => {
  try {
    const currentUser = req.user;

    // Check if the user is a seller
    const user = await User.findByPk(currentUser.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Fetch products by this seller
    const products = await Product.findAll({ where: { user_id: user.id } });
    const productIds = products.map((product) => product.id);

    if (!productIds.length) {
      return res.json([]); // No products, no orders
    }

    // Fetch order items for this seller's products
    const orderItems = await OrderItem.findAll({
      where: { product_id: productIds },
    });

    const orderIds = [...new Set(orderItems.map((item) => item.order_id))];

    // Fetch orders associated with the seller's products
    const orders = await Order.findAll({
      where: { id: orderIds },
    });

    // Format response
    const orderList = orders.map((order) => ({
      id: order.id,
      user_id: order.user_id,
      total_amount: order.total_amount,
      status: order.status,
      created_at: order.created_at,
      updated_at: order.updated_at,
    }));

    return res.json(orderList);
  } catch (error) {
    console.error("Error fetching seller orders:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/seller/order/:order_id", authenticateToken, async (req, res) => {
  try {
    const currentUser = req.user;

    // Validate user
    const user = await User.findByPk(currentUser.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if the order exists
    const order = await Order.findByPk(req.params.order_id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Fetch order items for the specific order
    const orderItems = await OrderItem.findAll({
      where: { order_id: req.params.order_id },
      include: [
        {
          model: Product,
          attributes: ["id", "name", "image_url", "user_id"],
        },
      ],
    });

    // Filter items to ensure seller only sees their products
    const sellerItems = orderItems.filter(
      (item) => item.Product.user_id === user.id
    );

    if (!sellerItems.length) {
      return res.status(403).json({ message: "No access to this order" });
    }

    // Format order details
    const orderDetails = {
      id: order.id,
      user_id: order.user_id,
      total_amount: order.total_amount,
      status: order.status,
      created_at: order.created_at,
      updated_at: order.updated_at,
      items: sellerItems.map((item) => ({
        product_id: item.product_id,
        product_name: item.Product.name,
        product_image: item.Product.image_url,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    return res.json(orderDetails);
  } catch (error) {
    console.error("Error fetching seller order:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/seller/discounts", authenticateToken, async (req, res) => {
  try {
    const current_user = req.user;

    // Fetch all products belonging to the authenticated seller
    const products = await Product.findAll({
      where: { user_id: current_user.id },
      attributes: ["id", "name", "image_url"], // Include product details
    });

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this seller" });
    }

    // Extract product IDs
    const productIds = products.map((product) => product.id);

    // Fetch discounts for the seller's products
    const discounts = await Discount.findAll({
      where: { product_id: productIds },
      include: [
        {
          model: Product,
          attributes: ["name", "image_url"], // Include additional fields
        },
      ],
    });

    return res.status(200).json(discounts);
  } catch (error) {
    console.error("Error fetching discounts:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching discounts" });
  }
});

// Add a discount
router.post("/seller/discount/add", authenticateToken, async (req, res) => {
  try {
    const current_user = req.user; // assuming req.user is populated by authenticateToken middleware

    const user = await User.findByPk(current_user.id);
    if (!user || !user.is_admin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { product_id, discount_percentage, start_date, end_date } = req.body;

    const product = await Product.findOne({
      where: { id: product_id, user_id: user.id },
    });

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found or not authorized" });
    }

    const newDiscount = await Discount.create({
      product_id,
      discount_percentage,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
    });

    return res
      .status(201)
      .json({ message: "Discount added successfully", discount: newDiscount });
  } catch (error) {
    console.error("Error adding discount:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while adding the discount" });
  }
});

// Edit a discount
router.put(
  "/seller/discount/edit/:discount_id",
  authenticateToken,
  async (req, res) => {
    try {
      const { discount_id } = req.params;
      const current_user = req.user;

      const user = await User.findByPk(current_user.id);
      if (!user || !user.is_admin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const discount = await Discount.findByPk(discount_id);
      if (!discount) {
        return res.status(404).json({ message: "Discount not found" });
      }

      const product = await Product.findOne({
        where: { id: discount.product_id, user_id: user.id },
      });

      if (!product) {
        return res
          .status(404)
          .json({ message: "Product not found or not authorized" });
      }

      const { discount_percentage, start_date, end_date } = req.body;

      discount.discount_percentage =
        discount_percentage || discount.discount_percentage;
      discount.start_date = new Date(start_date) || discount.start_date;
      discount.end_date = new Date(end_date) || discount.end_date;

      await discount.save();

      return res
        .status(200)
        .json({ message: "Discount updated successfully", discount });
    } catch (error) {
      console.error("Error updating discount:", error);
      return res
        .status(500)
        .json({ message: "An error occurred while updating the discount" });
    }
  }
);

// Delete a discount
router.delete(
  "/seller/discount/delete/:discount_id",
  authenticateToken,
  async (req, res) => {
    try {
      const { discount_id } = req.params;
      const current_user = req.user;

      const user = await User.findByPk(current_user.id);
      if (!user || !user.is_admin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const discount = await Discount.findByPk(discount_id);
      if (!discount) {
        return res.status(404).json({ message: "Discount not found" });
      }

      const product = await Product.findOne({
        where: { id: discount.product_id, user_id: user.id },
      });

      if (!product) {
        return res
          .status(404)
          .json({ message: "Product not found or not authorized" });
      }

      await discount.destroy();

      return res.status(200).json({ message: "Discount deleted successfully" });
    } catch (error) {
      console.error("Error deleting discount:", error);
      return res
        .status(500)
        .json({ message: "An error occurred while deleting the discount" });
    }
  }
);

module.exports = router;
