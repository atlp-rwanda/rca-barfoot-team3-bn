const express = require('express');
const { authenticate } = require('../../../middlewares/authenticate');
const { authorize } = require('../../../middlewares/authorize');
const upload = require('../../../utils/multer');

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

/**
 * @swagger
 * /api/v1/accommodations/{id}/upload-image:
 *  put:
 *    tags:
 *      - Accommodation
 *    description: Upload images of an accomodation
 *    parameters:
 *      - name: files
 *        in: formData
 *        type: file
 *        description: The file to upload
 *      - name: id
 *        in: params
 *        type: number
 *        description: The id of the accomodation
 *    responses:
 *      200:
 *        description: Images uploaded
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Unauthorized to create an accommodation
 */
router.put('/:id/upload-image', [authenticate, authorize('ADMIN'), upload.array('files')], AccomodationsController.uploadImage);

module.exports = router;
