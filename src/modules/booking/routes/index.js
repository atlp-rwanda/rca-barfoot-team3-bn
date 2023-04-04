const express = require('express');
const { authenticate } = require('../../../middlewares/authenticate');
const { authorize } = require('../../../middlewares/authorize');

const router = express.Router();
const { BookingController } = require('../controllers');

router.post('/:id', [authenticate], BookingController.createBooking);
router.get('/all', [authenticate], BookingController.getAllBookings);
router.put('/open/:id', [authenticate], BookingController.editOpenBooking);
router.put('/approve/:requestId', [authenticate, authorize('ADMIN')], BookingController.approveBooking);
router.put('/reject/:requestId', [authenticate, authorize('ADMIN')], BookingController.rejectBooking);
router.get('/rejected/all', [authenticate, authorize('ADMIN')], BookingController.getRejectedBookings);
router.get('/approved/all', [authenticate, authorize('ADMIN')], BookingController.getApprovedBookings);

// router.get('/', [authenticate], BookingController.getAllBookings);
router.get('/search', [authenticate], BookingController.searchBooking);
module.exports = router;
