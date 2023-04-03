const { DataTypes, ENUM } = require('sequelize');
const sequelize = require('../../../config/SequelizeConfig');

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         message:
 *           type: string
 *         read:
 *           type: boolean
 *         type:
 *           type: string
 *           enum:
 *             - BOOKING_APPROVAL
 *             - BOOKING_REJECTION
 *             - BOOKING_CONFIRMATION
 *             - BOOKING_CANCELLATION
 *         bookingId:
 *           type: integer
 *         receiverId:
 *           type: integer
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
 *         - receiverId
 *       example:
 *         id: 1
 *         title: "Booking Approval"
 *         message: "Your booking has been approved."
 *         read: false
 *         type: "BOOKING_APPROVAL"
 *         bookingId: 1
 *         receiverId: 1
 *         createdAt: "2022-01-01T00:00:00Z"
 *         updatedAt: "2022-01-01T00:00:00Z"
 */
const Notifications = sequelize.define('Notifications', {
    title: DataTypes.STRING,
    message: DataTypes.STRING,
    read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    type: {
        type: ENUM,
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

module.exports = Notifications;
