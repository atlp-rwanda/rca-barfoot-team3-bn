const { DataTypes } = require('sequelize');

const sequelize = require('../../../config/SequelizeConfig');

const EGender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
};

const User = sequelize.define('users', {
  first_name: DataTypes.STRING,
  last_name: DataTypes.STRING,
  email: DataTypes.STRING,
  gender: DataTypes.ENUM(Object.keys(EGender)),
  username: DataTypes.STRING,
  password: DataTypes.STRING,
  birthdate: DataTypes.DATE,
  preferred_language: DataTypes.STRING,
  preferred_currency: DataTypes.STRING,
  address: DataTypes.STRING,
  role: DataTypes.STRING,
  department: DataTypes.STRING,
  line_manager: DataTypes.STRING
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

User.hasOne(User, {
  foreignKey: 'line_manager'
});

const registrationSchema = {
  first_name: ['required', 'string', 'name_validations'],
  last_name: ['required', 'string', 'name_validations'],
  gender: ['required', 'in:MALE,FEMALE'],
  email: ['required', 'string', 'email'],
  username: ['required', 'min:3'],
  password: ['required', 'string', 'confirmed', 'password_validations'],
};
sequelize.sync();
module.exports = {
  User,
  registrationSchema
};
