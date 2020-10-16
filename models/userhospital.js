'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserHospital extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserHospital.belongsTo(models.User, {foreignKey: 'userId'})
      UserHospital.belongsTo(models.Hospital, {foreignKey: 'hospitalId'})
    }
  };
  UserHospital.init({
    userId: DataTypes.INTEGER,
    hospitalId: DataTypes.INTEGER,
    testingType: DataTypes.STRING,
    isWaitingResult: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'UserHospital',
  });
  return UserHospital;
};