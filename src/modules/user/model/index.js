// User model here
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../../config/SequelizeConfig');
class User extends Model {}
User.init({
  // attributes
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING
    // allowNull defaults to true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize, // We need to pass the connection instance
  modelName: 'User' // We need to choose the model name
  // Other model options go here
});
sequelize.sync();