const { Op } = require('sequelize');
const { validate } = require('../../../utils/validate');
const { Room } = require('../../accommodations/models');
const { User } = require('../../user/model');
const { Booking, bookingSchema } = require('../models');

/**
 * Booking Controller Class
 */
/**
 * @swagger
 * /rooms/{id}/bookings:
 *   post:
 *     summary: Creates a new booking for a room
 *     tags:
 *       - bookings
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the room to book
 *         schema:
 *           type: integer
 *       - in: body
 *         name: body
 *         required: true
 *         description: Booking details
 *         schema:
 *           type: object
 *           properties:
 *             dateToCome:
 *               type: string
 *               format: date-time
 *               description: Date and time when the guest will check-in
 *             dateToLeave:
 *               type: string
 *               format: date-time
 *               description: Date and time when the guest will check-out
 *           required:
 *             - dateToCome
 *             - dateToLeave
 *     responses:
 *       '201':
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Booking created successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       dateToCome:
 *                         type: string
 *                         format: date-time
 *                         example: '2023-03-25T12:00:00Z'
 *                       dateToLeave:
 *                         type: string
 *                         format: date-time
 *                         example: '2023-03-28T12:00:00Z'
 *                       user:
 *                         type: object
 *                         properties:
 *                           first_name:
 *                             type: string
 *                             example: John
 *                           last_name:
 *                             type: string
 *                             example: Doe
 *                       room:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: Deluxe Room
 *       '400':
 *         description: Bad request
 *         content
 * * */
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
          dateToCome: { [Op.lte]: dateToCome },
          dateToLeave: { [Op.gte]: dateToCome }
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
}
module.exports = { BookingController };
