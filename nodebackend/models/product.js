"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.hasMany(models.CartItem, {
        foreignKey: "product_id",
        onDelete: "CASCADE", // Optional: delete CartItems when Product is deleted
      });
      Product.hasMany(models.Review, {
        foreignKey: "product_id",
        onDelete: "CASCADE", // Optional: delete Reviews when Product is deleted
      });
      Product.hasMany(models.Discount, {
        foreignKey: "product_id",
        onDelete: "CASCADE", // Optional: If a product is deleted, delete its discounts
      });
      Product.belongsTo(models.User, {
        foreignKey: "user_id", // The foreign key in the Payment table linking to the User
        onDelete: "CASCADE", // Optional: If a user is deleted, delete the associated payments
      });
    }
  }
  Product.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      price: DataTypes.FLOAT,
      category: DataTypes.STRING,
      stock: DataTypes.INTEGER,
      image_url: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Product",
      tableName: 'Product',
      underscored: true
    }
  );
  return Product;
};
