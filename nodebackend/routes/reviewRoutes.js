const express = require("express");
const { User, Review } = require("../models");
const { authenticateToken } = require("../middleware/auth"); // JWT middleware
const router = express.Router();

// Error handling middleware
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Add review
router.post(
  "/review/add",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const userId = req.user.id; // JWT payload contains the user info
    const { product_id, rating, comment } = req.body;

    try {
      const newReview = await Review.create({
        user_id: userId,
        product_id,
        rating,
        comment,
      });
      return res
        .status(201)
        .json({ message: "Review added successfully", review: newReview });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error adding review", error: error.message });
    }
  })
);

// Edit review
router.put(
  "/review/edit/:review_id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { review_id } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findOne({
      where: { id: review_id, user_id: userId },
    });
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    await review.save();

    return res
      .status(200)
      .json({ message: "Review updated successfully", review });
  })
);

// Delete review
router.delete(
  "/review/delete/:review_id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { review_id } = req.params;

    const review = await Review.findOne({
      where: { id: review_id, user_id: userId },
    });
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await review.destroy();

    return res.status(200).json({ message: "Review deleted successfully" });
  })
);

module.exports = router;
