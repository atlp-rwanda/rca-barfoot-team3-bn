const { Op } = require('sequelize');
const { validate } = require('../../../utils/validate');
const { Room } = require('../../accommodation/models');
const { User } = require('../../user/model');
const { Booking, bookingSchema } = require('../models');
const { OneWayTrip } = require('../../trip/model');

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
      const { dateToCome, dateToLeave, onewaytripId } = body;
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
        onewaytripId: onewaytripId || null,
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

  //
  static async searchBooking(req, res) {
    try {
      const {
        origin,
        destination,
        requestId,
        approvalStatus,
      } = req.query;

      const where = {};

      if (requestId) {
        where.id = requestId;
      }

      if (approvalStatus) {
        where.approvalStatus = approvalStatus;
      }

      if (origin) {
        where['$onewaytrip.departure$'] = { [Op.like]: `%${origin}%` };
      }

      if (destination) {
        where['$onewaytrip.destination$'] = { [Op.like]: `%${destination}%` };
      }

      const bookings = await Booking.findAll({
        where,
        include: {
          model: OneWayTrip,
          as: 'onewaytrip'
        }
      });

      return res.status(200).json({
        status: 200,
        message: 'Bookings retrieved successfully',
        data: bookings
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = { BookingController };
