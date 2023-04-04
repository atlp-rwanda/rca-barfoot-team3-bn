/* eslint-disable camelcase */
/* eslint-disable max-len */
const { Op } = require('sequelize');
const nodemailer = require('nodemailer');
const { validate } = require('../../../utils/validate');
const { Room } = require('../../accommodation/models');
const { User } = require('../../user/model');
const { Booking, bookingSchema } = require('../models');
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

  static async approveBooking(req, res) {
    try {
      const { body } = req;
      const { approval_status } = body;
      const { user } = req;
      const bookingId = req.params.id;
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
