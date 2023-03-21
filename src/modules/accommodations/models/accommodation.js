const { DataTypes } = require('sequelize');

const sequelize = require('../../../config/SequelizeConfig');
const { User } = require('../../user/model');
const { Room, ERoomType } = require('./rooms');

const EAccommodationType = {
  HOTEL: 'HOTEL',
  LODGE: 'LODGE',
  MOTEL: 'MOTEL'
};

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

Room.belongsTo(Accommodation);
Accommodation.hasMany(Room, {
  foreignKey: 'accommodationId'
});

const creationSchema = {
  type: `required|string|in:${Object.keys(EAccommodationType).join(',')}`,
  location: 'required|string|min:3',
  rooms: 'required|array|min:1',
  'rooms.*.type': `required|string|in:${Object.keys(ERoomType).join(',')}`,
  'rooms.*.name': 'required|string|min:3'
};

module.exports = {
  Accommodation,
  creationSchema
};
