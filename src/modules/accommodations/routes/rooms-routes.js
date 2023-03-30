const express = require('express');
const { authenticate } = require('../../../middlewares/authenticate');
const { authorize } = require('../../../middlewares/authorize');
const upload = require('../../../utils/multer');

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

/**
 * @swagger
 * /api/v1/rooms/{id}/upload-image:
 *  put:
 *    tags:
 *      - Rooms
 *    description: Upload images of an room
 *    parameters:
 *      - name: files
 *        in: formData
 *        type: file
 *        description: The file to upload
 *      - name: id
 *        in: params
 *        type: number
 *        description: The id of the room
 *    responses:
 *      200:
 *        description: Images uploaded
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Unauthorized to create an room
 */
router.put('/:id/upload-image', [authenticate, authorize('ADMIN'), upload.array('files')], RoomsController.uploadImage);

module.exports = router;
