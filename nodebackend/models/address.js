"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Address.belongsTo(models.User, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
      });
    }
  }
  Address.init(
    {
      user_id: DataTypes.INTEGER,
      street: DataTypes.STRING,
      city: DataTypes.STRING,
      state: DataTypes.STRING,
      zip_code: DataTypes.STRING,
      country: DataTypes.STRING,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Address",
      tableName: "Address",
      underscored: true
    }
  );
  return Address;
};
