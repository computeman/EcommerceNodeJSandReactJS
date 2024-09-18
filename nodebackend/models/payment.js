"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Payment.belongsTo(models.Order, {
        foreignKey: "order_id", // The foreign key in the Payment table linking to the Order
        onDelete: "CASCADE", // Optional: If an order is deleted, delete the associated payments
      });

      // Payment belongs to User
      Payment.belongsTo(models.User, {
        foreignKey: "user_id", // The foreign key in the Payment table linking to the User
        onDelete: "CASCADE", // Optional: If a user is deleted, delete the associated payments
      });
    }
  }
  Payment.init(
    {
      user_id: DataTypes.INTEGER,
      order_id: DataTypes.INTEGER,
      amount: DataTypes.FLOAT,
      payment_method: DataTypes.STRING,
      status: DataTypes.STRING,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Payment",
      tableName: 'Payment',
      underscored: true
    }
  );
  return Payment;
};
