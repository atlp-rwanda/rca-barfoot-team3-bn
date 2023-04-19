const express = require('express');
const { authenticate } = require('../../../middlewares/authenticate');
const { authorize } = require('../../../middlewares/authorize');

const router = express.Router();
const { BookingController } = require('../controllers');
const { CommentController } = require('../../comment/controllers');

/**
 * @swagger
 * /bookings/{id}:
 *   post:
 *     summary: Create a booking for a room
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the room to book
 *       - in: body
 *         name: body
 *         description: The booking details
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             dateToCome:
 *               type: string
 *               format: date
 *               description: The date the guest will check-in
 *             dateToLeave:
 *               type: string
 *               format: date
 *               description: The date the guest will check-out
 *     responses:
 *       '201':
 *         description: A successful response, the booking has been created
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
 *                         format: date
 *                         example: 2023-03-20
 *                       dateToLeave:
 *                         type: string
 *                         format: date
 *                         example: 2023-03-25
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
 *                             example: "Deluxe Room"
 *       '400':
 *         description: Bad request. There's something wrong with the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 error:
 *                   type: string
 *                   example: dateToCome is required
 *       '401':
 *         description: 'Unauthorized'
 *       '404':
 *         description: The room was not found or it is already booked for the requested dates
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Room not found
 */

router.post('/:id', [authenticate], BookingController.createBooking);
router.get('/all', [authenticate], BookingController.getAllBookings);
router.put('/open/:id', [authenticate], BookingController.editOpenBooking);
router.put('/approve/:requestId', [authenticate, authorize('ADMIN')], BookingController.approveBooking);
router.put('/reject/:requestId', [authenticate, authorize('ADMIN')], BookingController.rejectBooking);
router.get('/rejected/all', [authenticate, authorize('ADMIN')], BookingController.getRejectedBookings);
router.get('/approved/all', [authenticate, authorize('ADMIN')], BookingController.getApprovedBookings);
router.post('/:bookingId/comment', [authenticate, authorize('ADMIN', 'USER', 'MANAGER')], CommentController.createComment);
router.get('/:bookingId/comments', [authenticate, authorize('ADMIN', 'USER', 'MANAGER')], CommentController.getCommentsByBookingId);

// router.get('/', [authenticate], BookingController.getAllBookings);
router.get('/search', [authenticate], BookingController.searchBooking);
module.exports = router;
