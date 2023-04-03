const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/SequelizeConfig');

const ERoomType = {
  STANDARD: 'STANDARD',
  DELUXE: 'DELUXE',
  SUITE: 'SUITE'
};

/**
 * @swagger
 * definitions:
 *   Room:
 *     properties:
 *       accommodation_id:
 *         type: number
 *       type:
 *         type: string
 *       description:
 *         type: string
 *       pricing:
 *         type: object
 *         properties:
 *          plans:
 *           type: array
 *           items:
 *            type: object
 *            properties:
 *              id:
 *                type: number
 *              duration:
 *                type: string
 *              price:
 *                type: number
 *              description:
 *                type: string
 *              benefits:
 *                type: array
 *                items:
 *                  type: string
 *       meta:
 *         type: object
 *         properties:
 *           max_occupancy:
 *             type: string
 *           bed_type:
 *             type: string
 *           room_size:
 *             type: string
 *           view:
 *             type: string
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
const Room = sequelize.define('rooms', {
  accommodation_id: DataTypes.INTEGER,
  type: DataTypes.ENUM(Object.keys(ERoomType)),
  description: DataTypes.STRING,
  pricing: DataTypes.JSON,
  meta: DataTypes.JSON,
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const createRoomSchema = {
  accommodation_id: 'integer|required',
  type: `string|required|in:${Object.keys(ERoomType).join(',')}`,
  description: 'string|required',
  'pricing.plans': 'array|required|min:1',
  'pricing.plans.*.id': 'integer|required',
  'pricing.plans.*.duration': 'string|required',
  'pricing.plans.*.price': 'integer|required',
  'pricing.plans.*.description': 'string|required',
  'pricing.plans.*.benefits': 'array|required|min:1',
  'meta.max_occupancy': 'string|required',
  'meta.bed_type': 'string|required',
  'meta.room_size': 'string|required',
  'meta.view': 'string|required',
  'meta.amenities': 'array|required|min:1',
  'meta.policies': 'array|required|min:1',
  'meta.properties': 'array|required|min:1'
};

module.exports = {
  ERoomType,
  Room,
  createRoomSchema
};
