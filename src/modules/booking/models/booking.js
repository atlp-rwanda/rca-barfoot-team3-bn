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

const Booking = sequelize.define('bookings', {
  dateToCome: DataTypes.DATE,
  dateToLeave: DataTypes.DATE,
  approval_status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});
const bookingSchema = {
  dateToCome: 'required|date',
  dateToLeave: 'required|date',
  approval_status: false,
};
User.hasMany(Booking);
Booking.belongsTo(User);

Room.hasMany(Booking);
Booking.belongsTo(Room);

module.exports = {
  Booking,
  bookingSchema
};
