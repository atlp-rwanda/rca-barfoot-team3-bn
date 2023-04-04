const express = require('express');
const { authenticate } = require('../../../middlewares/authenticate');

const router = express.Router();
const { BookingController } = require('../controllers');

router.post('/:id', [authenticate], BookingController.createBooking);
router.get('/search',[authenticate], BookingController.searchBookings);
module.exports = router;
