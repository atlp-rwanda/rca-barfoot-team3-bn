const { Op } = require('sequelize');
const { validate } = require('../../../utils/validate');
const { Room } = require('../../accommodation/models');
const { User } = require('../../user/model');
const { Booking, bookingSchema } = require('../models');

/**
 * Booking Controller Class
 */
class BookingController {
  /**
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @returns {*} booking details
   */
  static async createBooking(req, res) {
    try {
      const { body } = req;
      const { error } = validate(body, bookingSchema);
      if (error) {
        return res.status(400).json({
          status: 400,
          error: error.details[0].message
        });
      }
      const { dateToCome, dateToLeave } = body;
      const { user } = req;
      const RoomId = req.params.id;
      const room = await Room.findOne({ where: { id: RoomId } });
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
      await Booking.findOne({
        where: {
          roomId: RoomId,
          dateToCome: { [Op.lte]: new Date(dateToCome) },
          dateToLeave: { [Op.gte]: new Date(dateToCome) }
        }
      }).then((booking) => {
        if (booking) {
          return res.status(404).json({ error: 'Room is already booked' });
        }
      });
      const booking = await Booking.create({
        roomId: RoomId,
        userId: user.id,
        dateToCome,
        dateToLeave,
      });
      const data = await Booking.findAll({
        include: [
          { model: User, attributes: ['first_name', 'last_name'] },
          { model: Room, attributes: ['name'] }
        ],
        where: {
          id: booking.id
        }
      });
      return res.status(201).json({
        status: 201,
        message: 'Booking created successfully',
        data
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  }
  
  static async getAllBookings(req, res) {
    const { page = 1, limit = 10 } = req.query; // default to page 1 and limit 10
    const offset = (page - 1) * limit;
  
    const bookings = await Booking.findAndCountAll({
      limit: limit,
      offset: offset
    });
  
    const totalPages = Math.ceil(bookings.count / limit);
  
    let previousPage = page - 1;
    if (previousPage < 1) {
      previousPage = null;
    }
  
    let nextPage = page + 1;
    if (nextPage > totalPages) {
      nextPage = null;
    }
  
    return res.status(200).json({
      bookings: bookings.rows,
      currentPage: page,
      previousPage: previousPage,
      nextPage: nextPage,
      totalPages: totalPages
    });
  }
  
  

  static async approveBooking(req, res) {
    try {
      const { body } = req;
      const { approval_status } = body;
      const bookingId = req.params.bookingId;
      const booking = await Booking.findByPk(bookingId, {
        include: [
          { model: User, attributes: ['first_name', 'last_name'] },
          { model: Room, attributes: ['name'] }
        ]
      });
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      const updatedBooking = await booking.update({ approval_status });
      const data = {
        user: booking.User,
        message: 'Booking approval status updated'
      };
      return res.status(200).json({
        status: 200,
        data
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  }
}
module.exports = { BookingController };
