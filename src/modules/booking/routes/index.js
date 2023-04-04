const express = require('express');
const { authenticate } = require('../../../middlewares/authenticate');
const { authorize } = require('../../../middlewares/authorize');

const router = express.Router();
const { BookingController } = require('../controllers');

router.post('/:id', [authenticate], BookingController.createBooking);
router.post('/approve/:bookingId', [authenticate, authorize('ADMIN')], BookingController.approveBooking);
router.get('/', [authenticate], BookingController.getAllBookings);
module.exports = router;
