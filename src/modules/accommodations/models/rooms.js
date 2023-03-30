const { DataTypes } = require('sequelize');

const sequelize = require('../../../config/SequelizeConfig');

const ERoomType = {
  SMALL: 'SMALL',
  LARGE: 'LARGE',
  EXTRA_LARGE: 'EXTRA_LARGE'
};

/**
 * @swagger
 * definitions:
 *   Room:
 *     properties:
 *       accommodationId:
 *         type: string
 *       type:
 *         type: string
 *       name:
 *         type: string
 */
const Room = sequelize.define('rooms', {
  accommodationId: DataTypes.NUMBER,
  type: DataTypes.ENUM(Object.keys(ERoomType)),
  name: DataTypes.STRING
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const createRoomSchema = {
  accommodationId: "string|required",
  type: `string|required|in:${Object.keys(ERoomType).join(',')}`,
  name: "string|required",
}

module.exports = {
  ERoomType,
  Room,
  createRoomSchema
};
