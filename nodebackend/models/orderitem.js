'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OrderItem.belongsTo(models.Order, {
        foreignKey: 'order_id',
        onDelete: 'CASCADE', // Optional: delete OrderItems when Order is deleted
      });

      // OrderItem belongs to Product
      OrderItem.belongsTo(models.Product, {
        foreignKey: 'product_id',
        onDelete: 'SET NULL', // Optional: set product_id to NULL when Product is deleted
      });
    }
  }
  OrderItem.init({
    order_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'OrderItem',
    tableName: 'OrderItem',
    underscored: true
  });
  return OrderItem;
};