const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/SequelizeConfig');
const { User } = require('../../user/model');
const { Room } = require('../../accommodations/models');

const Booking = sequelize.define('bookings', {
  dateToCome: DataTypes.DATE,
  dateToLeave: DataTypes.DATE,
  approval_status:{
    type:DataTypes.BOOLEAN,
    default:false
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});
const bookingSchema = {
  dateToCome: 'required|date',
  dateToLeave: 'required|date',
  approval_status:'boolean',
};
User.hasMany(Booking);
Booking.belongsTo(User);

Room.hasMany(Booking);
Booking.belongsTo(Room);

module.exports = {
  Booking,
  bookingSchema
};
