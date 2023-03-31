const express = require("express")

const upload = require('../../../utils/multer');
const { FileController } = require("../controllers")

const router = express.Router();

/**
 * @swagger
 * /api/v1/files:
 *  post:
 *    tags:
 *      - Files
 *    description: Upload files
 *    parameters:
 *      - name: files
 *        in: formData
 *        type: file
 *        description: The file to upload
 *    responses:
 *      200:
 *        description: Images uploaded
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Unauthorized to create an accommodation
 */
router.post('/', upload.array('files'), FileController.uploadImage);

/**
 * @swagger
 * /api/v1/files:
 *  delete:
 *    tags:
 *      - Files
 *    description: Upload files
 *    parameters:
 *      - name: body
 *        in: body
 *        type: object
 *        description: The file to deleted
 *        properties:
 *          path:
 *           type: string
 *    responses:
 *      200:
 *        description: Images uploaded
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Unauthorized to create an accommodation
 */
router.delete('/', FileController.delete);

module.exports = router