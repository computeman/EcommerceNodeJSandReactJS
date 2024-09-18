// const express = require("express");
// const router = express.Router();
// const { Product, Discount, User } = require("../models");

// // GET /products - List products with optional filters for category, min_price, max_price
// router.get("/products", async (req, res) => {
//   try {
//     const { category, min_price, max_price } = req.query;

//     // Build query options for Sequelize
//     let queryOptions = {
//       include: [{ model: Discount, attributes: ["percentage", "description"] }],
//     };

//     if (category) {
//       queryOptions.category = category;
//     }

//     if (min_price || max_price) {
//       queryOptions.price = {};
//       if (min_price) queryOptions.price["$gte"] = min_price;
//       if (max_price) queryOptions.price["$lte"] = max_price;
//     }

//     // Fetch products with discounts from the database
//     const products = await Product.findAll({ where: queryOptions });

//     // Return the list of products in JSON format with the discount details
//     res.json(
//       products.map((product) => ({
//         id: product.id,
//         name: product.name,
//         price: product.price,
//         category: product.category,
//         stock: product.stock,
//         description: product.description,
//         image_url: product.image_url,
//         discount: product.Discount
//           ? {
//               percentage: product.Discount.discount_percentage,
//             }
//           : null, // Add discount if exists, otherwise null
//       }))
//     );
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // GET /products/:id - Get product details by product ID with seller's name and discount
// router.get("/products/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Fetch product by ID, including the seller's name (User) and discount
//     const product = await Product.findByPk(id, {
//       include: [
//         { model: User, attributes: ["name"] }, // Include seller's name
//         { model: Discount, attributes: ["percentage", "description"] }, // Include discount details
//       ],
//     });

//     if (!product) {
//       return res.status(404).json({ error: "Product not found" });
//     }

//     // Return the product details with seller and discount info
//     res.json({
//       id: product.id,
//       name: product.name,
//       price: product.price,
//       category: product.category,
//       stock: product.stock,
//       description: product.description,
//       image_url: product.image_url,
//       seller: product.User.name, // Seller's name
//       discount: product.Discount
//         ? {
//             percentage: product.Discount.discount_percentage,
//           }
//         : null, // Add discount if exists, otherwise null
//     });
//   } catch (error) {
//     console.error("Error fetching product details:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const { Product, User, Discount, Review } = require("../models");
const { Op, fn, col } = require("sequelize");

// GET /products - List products with optional filters for category, min_price, max_price
router.get("/products", async (req, res) => {
  try {
    const { category, min_price, max_price } = req.query;

    let queryOptions = {
      include: [
        {
          model: Discount,
          attributes: ["discount_percentage"],
          where: {
            start_date: { [Op.lte]: new Date() }, // Discount start date <= current date
            end_date: { [Op.gte]: new Date() }, // Discount end date >= current date
          },
          required: false, // Allow products without discounts
        },
      ],
    };

    if (category) {
      queryOptions.where = { ...queryOptions.where, category };
    }

    if (min_price || max_price) {
      queryOptions.where = { ...queryOptions.where, price: {} };
      if (min_price) queryOptions.where.price["$gte"] = min_price;
      if (max_price) queryOptions.where.price["$lte"] = max_price;
    }

    const products = await Product.findAll(queryOptions);

    res.json(
      products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        stock: product.stock,
        description: product.description,
        image_url: product.image_url,
        discount: product.Discount
          ? {
              percentage: product.Discount.discount_percentage,
            }
          : null, // Add discount if valid, otherwise null
      }))
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch product by ID, include seller name, valid discount, average rating, and number of reviews
    const product = await Product.findByPk(id, {
      include: [
        { model: User, attributes: ["name"] }, // Include seller's name
        {
          model: Discount,
          as: "Discounts", // Ensure alias is consistent
          attributes: ["discount_percentage"],
          where: {
            start_date: { [Op.lte]: new Date() },
            end_date: { [Op.gte]: new Date() },
          },
          required: false, // Include discount if valid
        },
        {
          model: Review,
          attributes: [], // Don't return actual reviews, only aggregate data
        },
      ],
      attributes: {
        include: [
          // Get average rating and number of reviews
          [fn("AVG", col("Reviews.rating")), "avgRating"],
          [fn("COUNT", col("Reviews.id")), "reviewCount"],
        ],
      },
      group: [
        "Product.id",
        "User.id", // Group by User
        "Discounts.id", // Use the alias 'Discounts' here
      ],
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Return the product details, average rating, and review count
    res.json({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      description: product.description,
      image_url: product.image_url,
      seller: product.User.name,
      discount: product.Discounts
        ? {
            percentage: product.Discounts.discount_percentage,
          }
        : null,
      avgRating: product.dataValues.avgRating || 0, // Return the average rating
      reviewCount: product.dataValues.reviewCount || 0, // Return the number of reviews
    });
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({ error: "Server error" });
  }
});
router.get("/products/:id/reviews", async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch all reviews for the product, including the reviewer's name
    const reviews = await Review.findAll({
      where: { product_id: id },
      include: [{ model: User, attributes: ["name"] }], // Include reviewer's name
    });

    res.json(
      reviews.map((review) => ({
        rating: review.rating,
        comment: review.comment,
        user: review.User.name, // Return reviewer's name
      }))
    );
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
