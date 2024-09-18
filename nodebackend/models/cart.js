"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Cart.belongsTo(models.User, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
      });
      Cart.hasMany(models.CartItem, {
        foreignKey: 'cart_id',
        onDelete: 'CASCADE', // Optional: delete CartItems when the Cart is deleted
      });
    }
  }
  Cart.init(
    {
      user_id: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Cart",
      tableName: 'Cart',
      underscored: true
    }
  );
  return Cart;
};
