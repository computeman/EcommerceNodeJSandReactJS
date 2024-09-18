"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Cart.hasMany(models.CartItem, {
        foreignKey: "cart_id",
        onDelete: "CASCADE", // Optional: delete CartItems when the Cart is deleted
      });
      CartItem.belongsTo(models.Product, {
        foreignKey: "product_id",
        onDelete: "CASCADE", // Optional: delete CartItem when the Product is deleted
      });
    }
  }
  CartItem.init(
    {
      cart_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "CartItem",
      tableName: 'CartItem',
      underscored: true
    }
  );
  return CartItem;
};
