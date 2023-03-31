/**
 * @swagger
 * definitions:
 *   Booking:
 *     properties:
 *       id:
 *         type: integer
 *       dateToCome:
 *         type: string
 *         format: date
 *       dateToLeave:
 *         type: string
 *         format: date
 *       status:
 *         type: string
 *         enum: [PENDING, APPROVED, REJECTED]
 *     required:
 *       - dateToCome
 *       - dateToLeave
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/SequelizeConfig');
const { User } = require('../../user/model');
const { Room } = require('../../accommodations/model');

const Booking = sequelize.define('Booking', {
  dateToCome: DataTypes.DATE,
  dateToLeave: DataTypes.DATE,
  status: {
    type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
    defaultValue: 'PENDING'
  },
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

module.exports = {
  Booking,
  bookingSchema
};
