/* eslint-disable max-len */
const express = require('express');

const router = express.Router();
const { authenticate } = require('../../../middlewares/authenticate');
const { authorize } = require('../../../middlewares/authorize');
const { NotificationsController } = require('../controllers');

/**
 * @swagger
 * /notifications:
 *   post:
 *     summary: Create a new notification
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the notification
 *               message:
 *                 type: string
 *                 description: The message of the notification
 *               type:
 *                 type: string
 *                 description: The type of the notification
 *               bookingId:
 *                 type: integer
 *                 description: The ID of the booking associated with the notification
 *               receiverId:
 *                 type: integer
 *                 description: The ID of the user who will receive the notification
 *             example:
 *               title: New Booking
 *               message: A new booking has been made
 *               type: booking
 *               bookingId: 123
 *               receiverId: 456
 *     responses:
 *       '201':
 *         description: Notification created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message confirming the notification creation
 *                 data:
 *                   $ref: '#/components/schemas/Notification'
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message indicating the reason for the bad request
 *                 errors:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: array
 *                       items:
 *                         type: string
*/
router.post('/', [authenticate], NotificationsController.createNotification);

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Retrieve all notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 *       400:
 *         description: 'Bad Request'
 */
router.get('/', [authenticate], NotificationsController.getAllNotifications);

/**
 * @swagger
 * /notifications/{bookingId}:
 *   get:
 *     summary: Retrieve notifications by booking ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the booking to retrieve notifications for
 *     responses:
 *       200:
 *         description: Notification for the specified booking ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 *       400:
 *         description: 'Bad Request'
 */
router.get('/booking/:bookingId', [authenticate], NotificationsController.getNotificationsByBookingId);

/**
 * @swagger
 * /notifications/{userId}:
 *   get:
 *     summary: Retrieve notifications by user ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user whose notifications to retrieve
 *     responses:
 *       200:
 *         description: A list of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Bad Request
 */
router.get('/user/:userId', [authenticate], NotificationsController.getNotificationsByUserId);

/**
 * @swagger
 * /notifications/{notificationId}:
 *   delete:
 *     summary: Delete a notification by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the notification to delete
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Notification'
 *       400:
 *         descritption: 'Bad Request'
 *       404:
 *         description: Notification not found
 */
router.delete('/:id', [authenticate], NotificationsController.deleteNotification);

router.get('/:type/:bookingId', [authenticate, authorize('MANAGER', 'ADMIN')], NotificationsController.getNotificationsByBookingAndType);

router.put('/all/markRead/:userId', [authenticate], NotificationsController.markAllNotificationsAsRead)
module.exports = router;
