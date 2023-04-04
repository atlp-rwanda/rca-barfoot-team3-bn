/* eslint-disable camelcase */
/* eslint-disable max-len */
const { Op } = require('sequelize');
const nodemailer = require('nodemailer');
const { validate } = require('../../../utils/validate');
const { Room } = require('../../accommodation/models');
const { User } = require('../../user/model');
const { Booking, bookingSchema } = require('../models');
const { EBookingStatus } = require('../models/booking');
const { Accommodation } = require('../../accommodation/models');
const { Notification } = require('../../notification/model');

/**
 * Booking Controller Class
 */
class BookingController {
  /**
 *
 * @param {*} req ExpressRequest
 * @param {*} res ExpressResponse
 * @returns {*} verification code || validation errors
 */

  static async sendEmails(receiverEmail, bookingDetails) {
    const Transport = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_HOST_PORT,
      secure: process.env.MAIL_HOST_SECURE,
      auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const mailOptions = {
      to: receiverEmail,
      subject: 'Barefoot Nomad Booking Reservation',
      html: `<p>Your booking at ${bookingDetails.room.accommodation.name} between ${bookingDetails.dateToCome}</p>
      <p> and ${bookingDetails.dateToLeave} has been successfully sent.</p>
      <p> Waiting for their approval. </p>
      <p> For more information about ${bookingDetails.room.accommodation.name} visit ${bookingDetails.room.accommodation.contacts.website}</p>
      <Contact ${bookingDetails.room.accommodation.name} at: </p> 
      <p> Phone: ${bookingDetails.room.accommodation.contacts.phone_number}</p>
      <p> Email: ${bookingDetails.room.accommodation.contacts.email} </p>
          <p>Thank you for using Barefoot Nomad</p>`
    };

    Transport.sendMail(mailOptions, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Message sent');
      }
    });
  }

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
      const alreadyBooked = await Booking.findOne({
        where: {
          roomId: RoomId,
          dateToCome: { [Op.lte]: new Date(dateToCome) },
          dateToLeave: { [Op.gte]: new Date(dateToCome) }
        }
      });
      if (alreadyBooked) {
        return res.status(404).json({ error: 'Room is already booked' });
      }
      const booking = await Booking.create({
        roomId: RoomId,
        userId: user.id,
        dateToCome,
        dateToLeave,
        status: 'OPEN'
      });
      const data = await Booking.findAll({
        include: [
          { model: User, attributes: ['first_name', 'last_name', 'email'] },
          { model: Room, attributes: ['accommodation_id'], include: [{ model: Accommodation, attributes: ['name', 'created_by', 'contacts'] }] }
        ],
        where: {
          id: booking.id
        }
      });
      const DataJson = data[0].get({ plain: true });
      const message = `${DataJson.user.first_name} ${DataJson.user.last_name} wants to book a room 
      between ${DataJson.dateToCome} and ${DataJson.dateToLeave}`;
      const notification = {
        title: 'Booking notification',
        type: 'BOOKING_CONFIRMATION',
        bookingId: DataJson.id,
        receiverId: DataJson.room.accommodation.created_by,
        message
      };
      await Notification.create({
        ...notification
      });
      await BookingController.sendEmails(DataJson.user.email, DataJson);
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

  static async approveBooking(req, res) {
    try {
      const { requestId } = req.params;
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
          { model: Room, attributes: ['accommodation_id'] }
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
      const { requestId } = req.params;
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
          { model: Room, attributes: ['accommodation_id'] }
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

  static async getApprovedBookings(req, res) {
    const { page = 1, limit = 10 } = req.query; // default to page 1 and limit 10
    const offset = (page - 1) * limit;

    const bookings = await Booking.findAndCountAll({
      where: {
        status: EBookingStatus.APPROVED
      },
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

  static async getRejectedBookings(req, res) {
    const { page = 1, limit = 10 } = req.query; // default to page 1 and limit 10
    const offset = (page - 1) * limit;

    const bookings = await Booking.findAndCountAll({
      where: {
        status: EBookingStatus.REJECTED
      },
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
}
module.exports = { BookingController };
