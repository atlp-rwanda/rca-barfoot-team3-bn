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
  
    static async searchBooking(req, res) {
      try {
        const { query } = req;
        const { Op } = require('sequelize');
  
        const whereClause = {};
  
        // Apply filter by request ID
        if (query.requestId) {
          whereClause.id = query.requestId;
        }
  
        // Apply filter by owner
        if (query.owner) {
          whereClause['$User.first_name$'] = {
            [Op.iLike]: `%${query.owner}%`
          };
        }
  
        // Apply filter by destination
        if (query.destination) {
          whereClause.destination = {
            [Op.iLike]: `%${query.destination}%`
          };
        }
  
        // Apply filter by origin
        if (query.origin) {
          whereClause.origin = {
            [Op.iLike]: `%${query.origin}%`
          };
        }
  
        // Apply filter by duration
        if (query.duration) {
          whereClause.duration = query.duration;
        }
  
        // Apply filter by start date
        if (query.startDate) {
          whereClause.dateToCome = {
            [Op.gte]: new Date(query.startDate)
          };
        }
  
        // Apply filter by request status
        if (query.requestStatus) {
          whereClause.status = query.requestStatus;
        }
  
        const { id: accommodationId } = req.params;
        const accommodation = await Room.findOne({
          where: { id: accommodationId },
          include: [
            {
              model: User,
              attributes: ['first_name']
            }
          ]
        });
  
        if (!accommodation) {
          return res.status(404).json({ error: 'Accommodation not found' });
        }
  
        const bookings = await Booking.findAll({
          where: {
            roomId: accommodationId,
            ...whereClause
          },
          include: [
            {
              model: User,
              attributes: ['first_name']
            },
            {
              model: Room,
              attributes: ['name']
            }
          ]
        });
  
        return res.status(200).json({
          status: 200,
          message: 'Bookings retrieved successfully',
          data: {
            accommodation: accommodation.name,
            owner: accommodation.User.first_name,
            bookings
          }
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
      }
    }
  }
  

module.exports = { BookingController };
