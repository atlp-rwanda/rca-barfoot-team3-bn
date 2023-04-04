const express = require('express');
const { authenticate } = require('../../../middlewares/authenticate');
const { authorize } = require('../../../middlewares/authorize');

const router = express.Router();

const { AccomodationsController } = require('../controllers');

/**
 * @swagger
 * /api/v1/accommodations:
 *  get:
 *    tags:
 *      - Accommodation
 *    description: get all an accommodation
 *    responses:
 *      201:
 *        description: An accommtedodation is created
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Unauthorized to create an accommodation
 */
router.get('/', AccomodationsController.getAll);

/**
 * @swagger
 * /api/v1/accommodations/{id}:
 *  get:
 *    tags:
 *      - Accommodation
 *    description: get a room by id
 *    responses:
 *      201:
 *        description: An accommtedodation is created
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Unauthorized to create an accommodation
 */
router.get('/:id', AccomodationsController.getById);

/**
 * @swagger
 * /api/v1/accommodations:
 *  post:
 *    tags:
 *      - Accommodation
 *    description: Create an accommodation
 *    parameters:
 *      - name: body
 *        in: body
 *        required: true
 *        schema:
 *          $ref: '#/definitions/Accommodation'
 *    responses:
 *      201:
 *        description: An accommtedodation is created
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Unauthorized to create an accommodation
 */
router.post('/', [authenticate, authorize('ADMIN')], AccomodationsController.create);
router.put('/:id', [authenticate, authorize('ADMIN')], AccomodationsController.update);
router.delete('/:id', [authenticate, authorize('ADMIN')], AccomodationsController.deleteAccomodation);

module.exports = router;
