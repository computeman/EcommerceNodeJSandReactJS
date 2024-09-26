const express = require("express");
const router = express.Router();
const {
  User,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Product,
  Payment,
} = require("../models");
const { authenticateToken } = require("../middleware/auth");

router.post("/checkout", authenticateToken, async (req, res) => {
  const currentUser = req.user;

  try {
    const user = await User.findByPk(currentUser.id);
    const cart = await Cart.findOne({ where: { user_id: user.id } });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartItems = await CartItem.findAll({
      where: { cart_id: cart.id },
      include: [{ model: Product }],
    });

    if (!cartItems.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + item.quantity * item.Product.price;
    }, 0);

    const order = await Order.create({
      user_id: user.id,
      total_amount: totalAmount,
    });

    for (const item of cartItems) {
      await OrderItem.create({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.Product.price,
      });
      await item.destroy();
    }

    return res
      .status(201)
      .json({ message: "Order placed successfully", order_id: order.id });
  } catch (error) {
    console.error(error); // Log the error details
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});

// Get a specific order
router.get("/order/:order_id", authenticateToken, async (req, res) => {
  const order_id = req.params.order_id;
  const currentUser = req.user;

  try {
    const order = await Order.findOne({
      where: { id: order_id, user_id: currentUser.id },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const orderItems = await OrderItem.findAll({
      where: { order_id: order.id },
      include: [{ model: Product }],
    });

    const items = orderItems.map((item) => ({
      product_id: item.product_id,
      product_name: item.Product.name,
      quantity: item.quantity,
      price: item.price,
    }));

    return res.json({
      order_id: order.id,
      total_amount: order.total_amount,
      status: order.status,
      items: items,
      created_at: order.createdAt,
      updated_at: order.updatedAt,
    });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
});

// List all orders
router.get("/orders", authenticateToken, async (req, res) => {
  const currentUser = req.user;

  try {
    const orders = await Order.findAll({ where: { user_id: currentUser.id } });

    const ordersList = await Promise.all(
      orders.map(async (order) => {
        const orderItems = await OrderItem.findAll({
          where: { order_id: order.id },
          include: [{ model: Product }],
        });

        const items = orderItems.map((item) => ({
          product_id: item.product_id,
          product_name: item.Product.name,
          quantity: item.quantity,
          price: item.price,
        }));

        return {
          order_id: order.id,
          total_amount: order.total_amount,
          status: order.status,
          items: items,
          created_at: order.createdAt,
          updated_at: order.updatedAt,
        };
      })
    );

    return res.json({ orders: ordersList });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
});

// Create a payment for an order
router.post("/payment/:order_id", authenticateToken, async (req, res) => {
  const currentUser = req.user;
  const order_id = req.params.order_id;
  const data = req.body;

  try {
    const user = await User.findByPk(currentUser.id);
    const order = await Order.findOne({
      where: { id: order_id, user_id: user.id },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if payment already exists for this order
    const existingPayment = await Payment.findOne({
      where: { order_id: order.id },
    });

    if (existingPayment) {
      return res
        .status(400)
        .json({ message: "Payment already made for this order" });
    }

    // Create new payment
    const payment = await Payment.create({
      user_id: user.id,
      order_id: order.id,
      amount: order.total_amount,
      payment_method: data.payment_method,
      status: "Paid",
    });

    // Update order status if needed
    order.status = "Paid";
    await order.save();

    return res.status(201).json({
      message: "Payment processed successfully",
      payment_id: payment.id,
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Payment Error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
