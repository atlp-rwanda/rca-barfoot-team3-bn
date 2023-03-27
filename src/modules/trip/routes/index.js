const express = require('express');
const { authenticate } = require('../../../middlewares/authenticate');
const { OneWayTripController } = require('../controllers');

const router = express.Router();

router.post('/one-way', [authenticate], OneWayTripController.createOneWayTrip);

module.exports = router;
