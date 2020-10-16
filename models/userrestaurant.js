'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserRestaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserRestaurant.belongsTo(models.User, {foreignKey: 'userId'})
      UserRestaurant.belongsTo(models.Restaurant, {foreignKey: 'restaurantId'})
    }
  };
  UserRestaurant.init({
    userId: DataTypes.INTEGER,
    restaurantId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserRestaurant',
  });
  return UserRestaurant;
};