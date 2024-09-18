"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Discount extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Discount.belongsTo(models.Product, {
        foreignKey: "product_id",
        onDelete: "CASCADE", // Optional: If a product is deleted, delete its discounts
      });
    }
  }
  Discount.init(
    {
      product_id: DataTypes.INTEGER,
      discount_percentage: DataTypes.FLOAT,
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Discount",
      tableName: 'Discount',
      underscored: true
    }
  );
  return Discount;
};
