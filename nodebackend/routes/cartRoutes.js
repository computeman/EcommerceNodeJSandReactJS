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

router.post("/cart/add", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity } = req.body;

    // Check if the product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find or create the user's cart
    let cart = await Cart.findOne({ where: { user_id: userId } });
    if (!cart) {
      cart = await Cart.create({ user_id: userId });
    }

    // Find or create the cart item
    let cartItem = await CartItem.findOne({
      where: { cart_id: cart.id, product_id },
    });
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        cart_id: cart.id,
        product_id,
        quantity,
      });
    }

    res.status(201).json({ message: "Item added to cart" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to update a cart item
router.put("/cart/update/:cartItemId", authenticateToken, async (req, res) => {
  const cartItemId = parseInt(req.params.cartItemId, 10);
  const { quantity } = req.body;

  try {
    const user = req.user;
    const cart = await Cart.findOne({ where: { user_id: user.id } });

    if (!cart) {
      return res.status(200).json({ message: "Cart is empty" });
    }

    const cartItem = await CartItem.findOne({
      where: { id: cartItemId, cart_id: cart.id },
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in your cart" });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({ message: "Cart item updated successfully" });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Remove item from cart
router.delete(
  "/cart/remove/:cart_item_id",
  authenticateToken,
  async (req, res) => {
    const cart_item_id = req.params.cart_item_id;
    const currentUser = req.user;

    try {
      const user = await User.findByPk(currentUser.id);
      const cart = await Cart.findOne({ where: { user_id: user.id } });

      if (!cart) {
        return res.status(200).json({ message: "Cart is empty" });
      }

      const cartItem = await CartItem.findByPk(cart_item_id);

      if (!cartItem || cartItem.cart_id !== cart.id) {
        return res.status(404).json({ message: "Item not found in your cart" });
      }

      await cartItem.destroy();

      return res.status(200).json({ message: "Item removed from cart" });
    } catch {
      return res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
