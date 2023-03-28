const express = require('express');
const { authenticate } = require('../../../middlewares/authenticate');

const router = express.Router();
const { BookingController } = require('../controllers');

router.post('/:id', [authenticate], BookingController.createBooking);
module.exports = router;
