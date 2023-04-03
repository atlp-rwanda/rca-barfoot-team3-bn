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
 *           enum: ['BOOKING_APPROVAL', 'BOOKING_REJECTION', 'BOOKING_CONFIRMATION', 'BOOKING_CANCELLATION']
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

const Notification = sequelize.define('Notification', {
    title: DataTypes.STRING,
    message: DataTypes.STRING,
    read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    type: {
        type: DataTypes.ENUM,
        values: ['BOOKING_APPROVAL', 'BOOKING_REJECTION', 'BOOKING_CONFIRMATION', 'BOOKING_CANCELLATION'],
        allowNull: false
    },
    bookingId: DataTypes.INTEGER,
    receiverId: DataTypes.INTEGER,
}, {
    timestamps: true,
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

module.exports = { Notification };
