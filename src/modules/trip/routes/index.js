const express = require('express');
const { authenticate } = require('../../../middlewares/authenticate');
const { authorize } = require('../../../middlewares/authorize');
const { OneWayTripController } = require('../controllers');
const router = express.Router();

// router.post('/one-way', [authenticate, authorize('REQUESTER')], OneWayTripController.createOneWayTrip);
router.post('/one-way', OneWayTripController.createOneWayTrip);

module.exports = router;