const { Notification } = require('../model/notification');
/**

Notification Controller
@class
*/
class NotificationsController {
  /**
             * Create a new role
             * @param {Object} body - Notification object
             * @param {Object} res - Response object
             * @returns {Object} - Response object with created notification
             */
  static async createNotification(body) {
    const {
      title, message, bookingId, receiverId, type
    } = body;

    try {
      const notification = await Notification.create({
        title,
        message,
        type,
        bookingId,
        receiverId,
      });

      return notification;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Delete a notification
  /**
           * Create a new role
           * @param {Object} req - Request object
           * @param {Object} res - Response object
           * @returns {Object} - Response object with deleted notification
           */
  static async deleteNotification(req, res) {
    const { notificationId } = req.params;

    try {
      const notification = await Notification.findOne({ where: { id: notificationId } });
      if (!notification) {
        return res.status(404).json({ error: 'Notification not found' });
      }
      await notification.destroy();
      return res.status(200).json({
        message: 'Notification deleted successfully',
        data: notification
      });
    } catch (error) {
      return res.status(400).json({
        message: 'BAD_REQUEST',
        errors: {
          name: [
            error.message
          ]
        }
      });
    }
  }

  // Get all notifications
  /**
           * Create a new role
           * @param {Object} req - Request object
           * @param {Object} res - Response object
           * @returns {Object} - Response object with all notifications
           */
  static async getAllNotifications(req, res) {
    try {
      const notifications = await Notification.findAll();
      return res.status(200).json({
        message: 'Notification retrieved successfully',
        data: notifications
      });
    } catch (error) {
      return res.status(400).json({
        message: 'BAD_REQUEST',
        errors: {
          name: [
            error.message
          ]
        }
      });
    }
  }

  // Get notifications by userId
  /**
           * Create a new role
           * @param {Object} req - Request object
           * @param {Object} res - Response object
           * @returns {Object} - Response object with all notifications by a user
           */
  static async getNotificationsByUserId(req, res) {
    const { userId } = req.params;

    try {
      const notifications = await Notification.findAll({ where: { receiverId: userId } });
      return res.status(200).json({
        message: 'Notification retrieved successfully',
        data: notifications
      });
    } catch (error) {
      return res.status(400).json({
        message: 'BAD_REQUEST',
        errors: {
          name: [
            error.message
          ]
        }
      });
    }
  }

  // Get notifications by bookingId
  /**
          * Create a new role
          * @param {Object} req - Request object
          * @param {Object} res - Response object
          * @returns {Object} - Response object with all notifications by a booking
          */
  static async getNotificationsByBookingId(req, res) {
    const { bookingId } = req.params;
    try {
      const notifications = await Notification.findAll({ where: { bookingId } });
      return res.status(200).json({
        message: 'Notification retrieved successfully',
        data: notifications
      });
    } catch (error) {
      return res.status(400).json({
        message: 'BAD_REQUEST',
        errors: {
          name: [
            error.message
          ]
        }
      });
    }
  }

  // Get notifications by booking and type
  /**
          * Create a new role
          * @param {Object} req - Request object
          * @param {Object} res - Response object
          * @returns {Object} - Response object with all notifications by a booking
          */
  static async getNotificationsByBookingAndType(req, res) {
    const { type, bookingId } = req.params;
    try {
      const notifications = await Notification.findAll({ where: { type, bookingId } });
      return res.status(200).json({
        message: 'Notifications retrieved successfully',
        data: notifications
      });
    } catch (error) {
      return res.status(400).json({
        message: 'BAD_REQUEST',
        errors: {
          name: [
            error.message
          ]
        }
      });
    }
  }

  static async markAllNotificationsAsRead(req, res) {
    try {
      const userId = req.user.id;

      const notifications = await Notification.findAll({
        where: { receiverId: userId, read: false }
      });

      if (notifications.length === 0) {
        return res.status(500).json({
          success: false,
          message: 'User has no unread notifications.',
        });
      }

      const [numUpdated] = await Notification.update(
        { read: true },
        { where: { receiverId: userId, read: false } }
      );

      if (numUpdated > 0) {
        return res.status(200).json({
          success: true,
          message: 'Notifications marked as read.',
        });
      }
      return res.status(500).json({
        success: false,
        message: 'No notifications to mark as read.',
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while marking notifications as read.',
        error: err.message,
      });
    }
  }
}

module.exports = { NotificationsController };
