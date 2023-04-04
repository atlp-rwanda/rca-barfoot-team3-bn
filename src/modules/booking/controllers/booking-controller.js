const { Op } = require('sequelize');
const { validate } = require('../../../utils/validate');
const { Room } = require('../../accommodation/models');
const { User } = require('../../user/model');
const { Booking, bookingSchema } = require('../models');
const { EBookingStatus } = require('../models/booking');

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
        status: 'OPEN'
      });
      const data = await Booking.findAll({
        include: [
          { model: User, attributes: ['first_name', 'last_name'] },
          { model: Room, attributes: ['accommodation_id'] }
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

  // /**
  //  * @param {Express.Request} req
  //  * @param {Express.Response} res
  //  * @returns {*} all booking details
  //  */
  // static async getAllBookings(req, res) {
  //   const bookings = await Booking.findAll();

  //   return res.status(200).json({
  //     bookings
  //   });
  // }

  /**
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @returns {*} edit open booking requests
   */

  static async editOpenBooking(req, res) {
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
      const user = req.user.id;
      const requestId = req.params.id;

      const booking = await Booking.findOne({ where: { id: requestId } });

      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      if (booking.status !== 'OPEN') {
        return res.status(400).json({ error: 'Cannot edit a closed booking' });
      }
      if (booking.userId !== user) {
        return res.status(400).json({ error: 'Unauthorized to edit this request' });
      }
      const room = await Room.findOne({ where: { id: booking.roomId } });
      if (!room) {
        return res.status(400).json({ error: 'Room not found' });
      }
      await Booking.findOne({
        where: {
          roomId: booking.roomId,
          dateToCome: { [Op.lte]: new Date(dateToCome) },
          dateToLeave: { [Op.gte]: new Date(dateToCome) },
          id: { [Op.ne]: requestId }
        }
      }).then((bookingFound) => {
        if (bookingFound) {
          return res.status(404).json({ error: 'Room is already booked for this time period' });
        }
      });
      booking.dateToCome = dateToCome;
      booking.dateToLeave = dateToLeave;
      await booking.save();
      const data = await Booking.findAll({
        include: [
          { model: User, attributes: ['first_name', 'last_name'] },
          { model: Room, attributes: ['description'] }
        ],
        where: {
          id: booking.id
        }
      });
      return res.status(200).json({
        status: 200,
        message: 'Booking edited successfully',
      })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
      }
    }
  static async getAllBookings(req, res) {
    const { page = 1, limit = 10 } = req.query; // default to page 1 and limit 10
    const offset = (page - 1) * limit;

    const bookings = await Booking.findAndCountAll({
      limit,
      offset
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
      previousPage,
      nextPage,
      totalPages
    });
  }

  // static async approveBooking(req, res) {
  //   try {
  //     const { body } = req;
  //     const { approvalStatus } = body;
  //     const { bookingId } = req.params;
  //     const booking = await Booking.findByPk(bookingId, {
  //       include: [
  //         { model: User, attributes: ['first_name', 'last_name'] },
  //         { model: Room, attributes: ['accommodation_id'] }
  //       ]
  //     });
  //     if (!booking) {
  //       return res.status(404).json({ error: 'Booking not found' });
  //     }
  //     const updatedBooking = await booking.update({ approvalStatus });
  //     const data = {
  //       user: booking.User,
  //       message: 'Booking approval status updated',
  //       updatedBooking
  //     };
  //     return res.status(200).json({
  //       status: 200,
  //       data
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).json({ error: 'Server error' });
  //   }
  // }

  static async approveBooking(req, res) {
    try {
      const requestId = req.params.requestId;
      const booking = await Booking.findOne({ where: { id: requestId } });
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      if (booking.status !== 'OPEN') {
        return res.status(400).json({ error: 'Cannot modify a non-pending booking' });
      }
    
      booking.status = EBookingStatus.APPROVED;
      await booking.save();
      const data = await Booking.findAll({
        include: [
          { model: User, attributes: ['first_name', 'last_name'] },
          { model: Room, attributes: ['accomodation_id'] }
        ],
        where: {
          id: booking.id
        }
      });
      return res.status(200).json({
        status: 200,
        message: 'Booking approved successfully',
        data
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  static async rejectBooking(req, res) {
    try {
      const requestId = req.params.requestId;
      const booking = await Booking.findOne({ where: { id: requestId } });
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      if (booking.status !== 'OPEN') {
        return res.status(400).json({ error: 'Cannot modify a non-pending booking' });
      }

      booking.status = EBookingStatus.REJECTED;
      await booking.save();
      const data = await Booking.findAll({
        include: [
          { model: User, attributes: ['first_name', 'last_name'] },
          { model: Room, attributes: ['accomodation_id'] }
        ],
        where: {
          id: booking.id
        }
      });
      return res.status(200).json({
        status: 200,
        message: 'Booking approved successfully',
        data
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  }


}
module.exports = { BookingController };
