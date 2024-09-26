// server.js

const express = require("express");
const sequelize = require("./db"); // Import the Sequelize instance
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();
app.use(express.json());

// Register your routes
app.use("/api", userRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", orderRoutes);
app.use("/api", reviewRoutes);

// Sync all models and start the server
sequelize
  .sync({ force: false })
  .then(() => {
    // force: true will drop the table if it already exists
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  })
  .catch((error) => {
    console.error("Unable to start the server:", error);
  });
