const { Op } = require('sequelize');
const { validate } = require('../../../utils/validate');
const { Room } = require('../../accommodations/model');
const { User } = require('../../user/model');
const { Booking, bookingSchema } = require('../model');

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
      const RoomId = req.params.roomId;
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

  /**
 * Update the status of a booking
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {*} booking details
 */
  static async updateBookingStatus(req, res) {
    // reject or approve a booking
    try {
      const { status } = req.body;
      const { id } = req.params;
      const { user } = req;

      if (!user.roles.includes('Manager')) {
        return res.status(403).json({ error: 'Only managers can perform this action' });
      }

      const booking = await Booking.findOne({ where: { id } });
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      await Booking.update({ status }, { where: { id } });
      return res.status(200).json({
        status: 200,
        message: 'Booking status updated successfully',
        data: {
          booking
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  }
}
module.exports = { BookingController };
