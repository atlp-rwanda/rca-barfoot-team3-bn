const express = require('express');
const { authenticate } = require('../../../middlewares/authenticate');
const { OneWayTripController } = require('../controllers');

const router = express.Router();
/**
 * @swagger
 * /api/v1/trip/requests:
 *  get:
 *    tags:
 *      - Requests
 *    description: Get All Requests
 *    responses:
 *      201:
 *        description: An accommtedodation is created
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Unauthorized to create an accommodation
 */
router.get("/requests", [authenticate], OneWayTripController.getRequests)

router.post('/one-way', [authenticate], OneWayTripController.createOneWayTrip);

module.exports = router;
