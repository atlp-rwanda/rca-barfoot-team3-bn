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

    /**
     * @param {Express.Request} req
     * @param {Express.Response} res
     * @returns {*} matching bookings
     */
    static async searchBookings(req, res) {
      try {
        const { query } = req;
        const { user } = req;
        const whereClause = {};
  
        // Add search filters based on the query parameters
        if (query.request_id) {
          whereClause.id = query.request_id;
        }
        if (query.destination) {
          whereClause.destination = { [Op.like]: `%${query.destination}%` };
        }
        if (query.origin) {
          whereClause.origin = { [Op.like]: `%${query.origin}%` };
        }
        if (query.duration) {
          whereClause.duration = { [Op.eq]: query.duration };
        }
        if (query.start_date) {
          whereClause.dateToCome = { [Op.gte]: new Date(query.start_date) };
        }
        if (query.request_status) {
          whereClause.status = query.request_status;
        }
  
        // Fetch all bookings for the user's accommodations
        const bookings = await Booking.findAll({
          where: whereClause,
          include: [
            {
              model: Room,
              where: { userId: user.id },
              attributes: []
            },
            {
              model: User,
              attributes: ['first_name', 'last_name']
            }
          ],
          order: [['id', 'DESC']] // Order by ID in descending order
        });
  
        return res.status(200).json({
          status: 200,
          data: bookings
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
      }
    }
  }
  

module.exports = { BookingController };
