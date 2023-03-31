const express = require("express")

const upload = require('../../../utils/multer');
const { FileController } = require("../controllers")

const router = express.Router();

/**
 * @swagger
 * /api/v1/files:
 *  put:
 *    tags:
 *      - Files
 *    description: Upload images of an accomodation
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
router.put('/:id/upload-image', upload.array('files'), FileController.uploadImage);

module.exports = router