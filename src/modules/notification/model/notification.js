/* eslint-disable max-len */
/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *         title:
 *           type: string
 *         message:
 *           type: string
 *         read:
 *           type: boolean
 *         type:
 *           type: string
 *           enum: ['APPROVED', 'REJECTED', 'OPEN']
 *         bookingId:
 *           type: integer
 *           format: int64
 *         receiverId:
 *           type: integer
 *           format: int64
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - title
 *         - message
 *         - type
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/SequelizeConfig');
const { ENotificationReason } = require('../../booking/models/booking');

const Notification = sequelize.define('Notification', {
  title: DataTypes.STRING,
  message: DataTypes.STRING,
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  type: {
    type: DataTypes.ENUM,
    values: Object.keys(ENotificationReason),
    allowNull: false
  },
  bookingId: DataTypes.INTEGER,
  receiverId: DataTypes.INTEGER,
}, {
  timestamps: true,
});

module.exports = { Notification };
