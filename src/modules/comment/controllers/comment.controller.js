const { Booking } = require('../../booking/models');
const { User } = require('../../user/model');
const Comment = require('../model/comment');

/**

Comment Controller
@class
*/

class CommentController {
  /**
    Create a new comment for a booking
    @param {Object} req - Express request object
    @param {Object} res - Express response object
    @returns {Object} - JSON response containing the newly created comment
    */
  static async createComment(req, res) {
    const { message } = req.body;
    const { bookingId } = req.params;
    const userId = req.user.id;

    try {
      const booking = await Booking.findByPk(bookingId);

      if (!booking) return res.status(400).json({ error: "This booking doesn't exist" });

      if (booking?.userId !== userId && !req.user.roles.includes('ADMIN')) {
        return res.status(400).json({ error: 'You cannot perform this operation' });
      }

      const comment = await Comment.create({
        message,
        userId,
        bookingId,
      });

      res.status(201).json({
        message: 'Comment created',
        data: comment
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Could not create comment' });
    }
  }

  /**

    Get all comments for a given booking ID
    @param {Object} req - Express request object
    @param {Object} res - Express response object
    @returns {Object} - JSON response containing all comments for the booking ID
    */
  static async getCommentsByBookingId(req, res) {
    const { bookingId } = req.params;
    try {
      const comments = await Comment.findAll({
        where: { bookingId },
        include: {
          model: User,
          attributes: ['id', 'first_name', 'last_name', 'email'],
        },
        order: [['created_at', 'DESC']],
      });

      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ error: 'Could not retrieve comments' });
    }
  }
}

module.exports = { CommentController };
