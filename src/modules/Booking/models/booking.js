const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/SequelizeConfig');
const { User } = require('../../user/model');
const { Room } = require('../../accommodations/models');

const Booking = sequelize.define('bookings', {
  dateToCome: DataTypes.DATE,
  dateToLeave: DataTypes.DATE,
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});
const bookingSchema = {
  dateToCome: 'required|date',
  dateToLeave: 'required|date',
};
User.belongsToMany(Room, { through: Booking });
Room.belongsToMany(User, { through: Booking });
module.exports = {
  Booking,
  bookingSchema
};
