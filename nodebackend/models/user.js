"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.Cart, {
        foreignKey: "user_id",
        onDelete: "CASCADE", // Optional: delete the Cart when the User is deleted
      });
      User.hasMany(models.Address, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
      });
      User.hasMany(models.Order, {
        foreignKey: "user_id",
        onDelete: "CASCADE", // Optional: delete Orders when User is deleted
      });
      User.hasMany(models.Review, {
        foreignKey: "user_id",
        onDelete: "CASCADE", // Optional: delete Reviews when User is deleted
      });
      User.hasMany(models.Payment, {
        foreignKey: "user_id", // Foreign key in the Payment table
        onDelete: "CASCADE", // Optional: delete Payments if User is deleted
      });
      User.hasMany(models.Product, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
      });
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password_hash: DataTypes.STRING,
      is_admin: DataTypes.BOOLEAN,
      is_owner: DataTypes.BOOLEAN,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "User",
      underscored: true,
    }
  );
  return User;
};
