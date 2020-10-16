'use strict';
const {
  Model
} = require('sequelize');
// const {hashData} = require('../helpers/bcrypt')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsToMany(models.Restaurant, {through: 'UserRestaurant', foreignKey: 'restaurantId'})
      User.belongsToMany(models.Hospital, {through: 'UserHospital', foreignKey: 'hospitalId'})
    }
  };
  User.init({
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: 'Phone Number is Required'
        },
        notEmpty: {
          args: true,
          msg: 'Phone Number is Required'
        }
      }
    },
    nik: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'NIK is Required'
        },
        notEmpty: {
          args: true,
          msg: 'NIK is Required'
        },
        len: {
          args: [6, 6],
          msg: 'Must Input 6 Digits NIK'
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Name is Required'
        },
        notEmpty: {
          args: true,
          msg: 'Name is Required'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Email is Required'
        },
        notEmpty: {
          args: true,
          msg: 'Email is Required'
        },
        isEmail: {
          args: true,
          msg: 'Invalid Email Format'
        }
      } 
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Status is Required'
        },
        notEmpty: {
          args: true,
          msg: 'Status is Required'
        }
      } 
    },
    deviceId: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Device Id is Required'
        },
        notEmpty: {
          args: true,
          msg: 'deviceId is Required'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  // User.addHook('beforeCreate', (user, opt) => {
  //   user.nik = hashData(user.nik)
  // })
  return User;
};