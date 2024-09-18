'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE', // Optional: delete Reviews when User is deleted
      });

      // Review belongs to Product
      Review.belongsTo(models.Product, {
        foreignKey: 'product_id',
        onDelete: 'CASCADE', // Optional: delete Reviews when Product is deleted
      });
    }
  }
  Review.init({
    user_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    rating: DataTypes.INTEGER,
    comment: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Review',
    tableName: 'Review',
    underscored: true
  });
  return Review;
};