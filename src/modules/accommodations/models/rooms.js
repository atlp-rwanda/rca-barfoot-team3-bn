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
 *       image_paths:
 *         type: string
 *       meta:
 *         type: object
 *         properties:
 *           properties:
 *             type: array
 *             items:
 *              type: string
 */
const Room = sequelize.define('rooms', {
  accommodationId: DataTypes.INTEGER,
  type: DataTypes.ENUM(Object.keys(ERoomType)),
  image_paths: DataTypes.STRING,
  meta: DataTypes.JSON,
  name: DataTypes.STRING
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const createRoomSchema = {
  accommodationId: "string|required",
  type: `string|required|in:${Object.keys(ERoomType).join(',')}`,
  meta: "required",
  'meta.properties': "array|required|min:1",
  name: "string|required",
}

module.exports = {
  ERoomType,
  Room,
  createRoomSchema
};
