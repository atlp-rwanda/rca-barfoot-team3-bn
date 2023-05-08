/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *         dateToCome:
 *           type: string
 *           format: date-time
 *         dateToLeave:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - dateToCome
 *         - dateToLeave
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/SequelizeConfig');
const { User } = require('../../user/model');
const { Room } = require('../../accommodation/models');
const { OneWayTrip, Request } = require('../../trip/model');

const ENotificationReason = {
  EDIT_BOOKING: 'EDIT_BOOKING',
  APPROVED_BOOKING: 'APPROVED_BOOKING',
  REJECTED_BOOKING: 'REJECTED_BOOKING',
  BOOKING_CONFIRMATION: 'BOOKING_CONFIRMATION',
  OPEN:'OPEN'
};
const Booking = sequelize.define('bookings', {
  dateToCome: DataTypes.DATE,
  dateToLeave: DataTypes.DATE,
  status: DataTypes.ENUM(Object.keys(ENotificationReason))
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});
const bookingSchema = {
  dateToCome: 'required|date',
  dateToLeave: 'required|date',
};

User.hasMany(Booking);
Booking.belongsTo(User);

Room.hasMany(Booking);
Booking.belongsTo(Room);

Booking.belongsTo(OneWayTrip);

Request.hasMany(Booking);
Booking.belongsTo(Request);

module.exports = {
  ENotificationReason,
  Booking,
  bookingSchema,
};
