const express = require('express');
const { authenticate } = require('../../../middlewares/authenticate');

const router = express.Router();
const { BookingController } = require('../controllers');

router.post('/:id', [authenticate], BookingController.createBooking);
router.get('/all', [authenticate], BookingController.getAllBookings);
router.put('/open/:id', [authenticate], BookingController.editOpenBooking);
module.exports = router;
