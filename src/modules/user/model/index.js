const { Sequelize, Model, DataTypes }  = require('sequelize');

const sequelize = require("../../../config/SequelizeConfig");

const User = sequelize.define('users', {
  username: DataTypes.STRING,
  created_at: DataTypes.STRING
}, {
  timestamps: true,
  createdAt: "created_at",
  updatedAt: 'updated_at'
});

module.exports.User = User