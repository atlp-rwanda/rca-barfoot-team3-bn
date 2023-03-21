const { DataTypes } = require('sequelize');

const sequelize = require('../../../config/SequelizeConfig');
const { User } = require('../../user/model');

const EAccommodationType = {
  HOTEL: "HOTEL",
  LODGE: "LODGE",
  MOTEL: "MOTEL"
}

const Accommodation = sequelize.define('accommodations', {
  created_by: DataTypes.NUMBER,
  type: DataTypes.ENUM(Object.keys(EAccommodationType)),
  location: DataTypes.STRING,
  image_path: DataTypes.STRING
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

Accommodation.hasOne(User, {
  foreignKey: 'created_by'
});


module.exports = {
  Accommodation
};
