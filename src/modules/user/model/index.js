const { DataTypes } = require('sequelize');

const sequelize = require('../../../config/SequelizeConfig');
const Role = require('../../role/model');

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
  token: DataTypes.STRING,
  department: DataTypes.STRING,
  line_manager: DataTypes.INTEGER,
  registration_type: DataTypes.ENUM('email', 'facebook', 'google'),
  verified: DataTypes.BOOLEAN,
  verification_code: DataTypes.INTEGER,
  verification_code_expiry_date: DataTypes.DATE,
}, {
  timestamps: true,
  freezeTableName: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'users',
});

User.belongsToMany(Role, { through: 'UserRole' });

User.hasOne(User, {
  foreignKey: 'line_manager'
});

/**
 * @swagger
 * definitions:
 *   User:
 *     properties:
 *       first_name:
 *         type: string
 *       last_name:
 *         type: string
 *       gender:
 *         type: enum
 *       email:
 *         type: string
 *       username:
 *         type: string
 *       password:
 *         type: string
 *     required:
 *       - firstName
 *       - lastName
 *       - gender
 *       - email
 *       - username
 *       - password
 */
const registrationSchema = {
  first_name: ['required', 'string', 'name_validations'],
  last_name: ['required', 'string', 'name_validations'],
  gender: ['required', 'in:MALE,FEMALE'],
  email: ['required', 'string', 'email'],
  username: ['required', 'min:3'],
  password: ['required', 'string', 'confirmed', 'password_validations']
};

const updateSchema = {
  first_name: ['string', 'name_validations'],
  last_name: ['string', 'name_validations'],
  gender: ['in:MALE,FEMALE'],
  email: ['string', 'email'],
  username: ['min:3'],
};
module.exports = {
  User,
  registrationSchema,
  updateSchema,
};
