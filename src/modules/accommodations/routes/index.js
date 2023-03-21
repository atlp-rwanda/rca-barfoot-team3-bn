const express = require('express');
const { authenticate } = require('../../../middlewares/authenticate');
const { authorize } = require('../../../middlewares/authorize');
const upload = require('../../../utils/multer');

const router = express.Router();

const { AccomodationsController } = require('../controllers');

router.post('/', [authenticate, authorize('ADMIN')], AccomodationsController.create);
router.put('/:id/upload-image', [authenticate, authorize('ADMIN'), upload.array('files')], AccomodationsController.uploadImage);

module.exports = router;
