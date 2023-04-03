const Notifications = require('../model/notification');
/**

Notification Controller
@class
*/
class NotificationsController {
    /**
         * Create a new role
         * @param {Object} req - Request object
         * @param {Object} res - Response object
         * @returns {Object} - Response object with created notification
         */
    static async createNotification(req, res) {
        const {
            title, message, bookingId, receiverId, type
        } = req.body;

        try {
            const notification = await Notifications.create({
                title,
                message,
                type,
                bookingId,
                receiverId,
            });
            return res.status(201).json({
                message: 'Notification created successfully',
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
            const notification = await Notifications.findOne({ where: { id: notificationId } });
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
            const notifications = await Notifications.findAll();
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
            const notifications = await Notifications.findAll({ where: { receiverId: userId } });
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
            const notifications = await Notifications.findAll({ where: { bookingId } });
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
}

module.exports = { NotificationsController };
