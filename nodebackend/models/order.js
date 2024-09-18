'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.hasMany(models.OrderItem, {
        foreignKey: 'order_id',
        onDelete: 'CASCADE', // Optional: delete OrderItems when Order is deleted
      });

      // Order has one Payment
      Order.hasOne(models.Payment, {
        foreignKey: 'order_id',
        onDelete: 'CASCADE', // Optional: delete Payment when Order is deleted
      });
      Order.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE', // Optional: delete Orders when User is deleted
      });
      Order.hasOne(models.Payment, {
        foreignKey: "order_id", // Foreign key in the Payment table
        onDelete: "CASCADE", // Optional: delete Payment if Order is deleted
      });
    }
  }
  Order.init({
    user_id: DataTypes.INTEGER,
    total_amount: DataTypes.FLOAT,
    status: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'Order',
    underscored: true
  });
  return Order;
};