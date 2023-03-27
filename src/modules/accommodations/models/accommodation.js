const { DataTypes } = require('sequelize');

const sequelize = require('../../../config/SequelizeConfig');
const { User } = require('../../user/model');
const { Room, ERoomType } = require('./rooms');

const EAccommodationType = {
  HOTEL: 'HOTEL',
  LODGE: 'LODGE',
  MOTEL: 'MOTEL'
};

/**
 * @swagger
 * definitions:
 *   Accommodation:
 *     properties:
 *       type:
 *         type: string
 *       location:
 *         type: string
 *       rooms:
 *         type: array
 *         items:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *             name:
 *               type: string
 */
const Accommodation = sequelize.define('accommodations', {
  created_by: DataTypes.NUMBER,
  type: DataTypes.ENUM(Object.keys(EAccommodationType)),
  name: DataTypes.STRING,
  location: DataTypes.STRING,
  image_path: DataTypes.STRING
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

User.hasMany(Accommodation, {
  foreignKey: 'created_by'
});
Accommodation.belongsTo(User, {
  foreignKey: 'created_by'
});

Room.belongsTo(Accommodation);
Accommodation.hasMany(Room, {
  foreignKey: 'accommodationId'
});

const creationSchema = {
  type: `required|string|in:${Object.keys(EAccommodationType).join(',')}`,
  name: 'required|string|min:3',
  location: 'required|string|min:3',
  rooms: 'required|array|min:1',
  'rooms.*.type': `required|string|in:${Object.keys(ERoomType).join(',')}`,
  'rooms.*.name': 'required|string|min:3'
};

module.exports = {
  Accommodation,
  creationSchema
};
