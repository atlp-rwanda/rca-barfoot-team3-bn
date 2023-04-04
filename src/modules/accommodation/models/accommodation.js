const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/SequelizeConfig');
const { User } = require('../../user/model');
const { Room } = require('./rooms');

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
 *       name:
 *         type: string
 *       description:
 *         type: string
 *       contacts:
 *         type: object
 *         properties:
 *            email:
 *              type: string
 *            phone_number:
 *              type: string
 *            website:
 *              type: string
 *       location:
 *         type: object
 *         properties:
 *           country:
 *             type: string
 *           province:
 *             type: string
 *           district:
 *             type: string
 *           city:
 *             type: string
 *           sector:
 *             type: string
 *           cell:
 *             type: string
 *           village:
 *             type: string
 *           latitude:
 *             type: string
 *           longitude:
 *             type: string
 *           postal_code:
 *             type: string
 *       meta:
 *         type: object
 *         properties:
 *           amenities:
 *             type: array
 *             items:
 *              type: string
 *           policies:
 *              type: array
 *              items:
 *                type: string
 *           images:
 *              type: array
 *              items:
 *                type: string
 *           properties:
 *              type: array
 *              items:
 *                type: string
 */
const Accommodation = sequelize.define('accommodations', {
  created_by: DataTypes.INTEGER,
  name: DataTypes.STRING,
  description: DataTypes.TEXT,
  type: DataTypes.ENUM(Object.keys(EAccommodationType)),
  location: DataTypes.JSON,
  meta: DataTypes.JSON,
  contacts: DataTypes.JSON,
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

Room.belongsTo(Accommodation, {
  foreignKey: 'accommodation_id'
});

Accommodation.hasMany(Room, {
  foreignKey: 'accommodation_id'
});

const creationSchema = {
  type: `required|string|in:${Object.keys(EAccommodationType).join(',')}`,
  name: 'required|string|min:3',
  description: 'required|string|min:3',
  'contacts.email': 'required|string|email|min:3',
  'contacts.phone_number': 'required|string|min:3',
  'contacts.website': 'required|string|url|min:3',
  'location.country': 'required|string|min:3',
  'location.province': 'required|string|min:3',
  'location.district': 'required|string|min:3',
  'location.city': 'required|string|min:3',
  'location.sector': 'required|string|min:3',
  'location.cell': 'required|string|min:3',
  'location.village': 'required|string|min:3',
  'location.latitude': 'required|string|min:3',
  'location.longitude': 'required|string|min:3',
  'location.postal_code': 'required|string|min:3',
  'meta.amenities': 'required|array|min:1',
  'meta.policies': 'required|array|min:1',
  'meta.properties': 'required|array|min:1',
};

module.exports = {
  Accommodation,
  creationSchema
};
