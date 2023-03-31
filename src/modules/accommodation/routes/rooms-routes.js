const express = require('express');
const { authenticate } = require('../../../middlewares/authenticate');
const { authorize } = require('../../../middlewares/authorize');

const router = express.Router();

const { RoomsController } = require('../controllers');

/**
 * @swagger
 * /api/v1/rooms:
 *  get:
 *    tags:
 *      - Rooms
 *    description: get all an room
 *    responses:
 *      201:
 *        description: An room is created
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Unauthorized to create an room
 */
router.get('/', RoomsController.getAll);

/**
 * @swagger
 * /api/v1/rooms/{id}:
 *  get:
 *    tags:
 *      - Rooms
 *    description: get a room by id
 *    responses:
 *      201:
 *        description: An room is created
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Unauthorized to create an room
 */
router.get('/:id', RoomsController.getById);

/**
 * @swagger
 * /api/v1/rooms:
 *  post:
 *    tags:
 *      - Rooms
 *    description: Create an room
 *    parameters:
 *      - name: body
 *        in: body
 *        required: true
 *        schema:
 *          $ref: '#/definitions/Room'
 *    responses:
 *      201:
 *        description: An room is created
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Unauthorized to create an room
 */
router.post('/', [authenticate, authorize('ADMIN')], RoomsController.create);

module.exports = router;
