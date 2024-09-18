// cartRoutes.js
const express = require("express");
const router = express.Router();
const { Cart, Product, CartItem } = require("../models");
const { authenticateToken } = require("../middleware/auth");

// GET /cart - Retrieve the current user's cart
router.get("/cart", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch the user's cart along with cart items and related products
    const cart = await Cart.findOne({
      where: { user_id: userId },
      include: {
        model: CartItem,
        include: {
          model: Product,
          attributes: ["id", "name", "price"],
        },
      },
    });

    if (!cart) {
      return res.status(200).json({ message: "Cart is empty" });
    }

    // Format cart items
    const cartItems = cart.CartItems.map((item) => ({
      id: item.id,
      product_id: item.product_id,
      product_name: item.Product.name,
      quantity: item.quantity,
      price: item.Product.price,
    }));

    // Calculate total amount
    const totalAmount = cartItems.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );

    res.status(200).json({ cart_items: cartItems, total_amount: totalAmount });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
