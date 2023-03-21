const express = require('express');
const { authenticate } = require('../../../middlewares/authenticate');
const { authorize } = require('../../../middlewares/authorize');

const router = express.Router();

const { AccomodationsController } = require('../controllers');

router.post('/', [authenticate, authorize("ADMIN")], AccomodationsController.create);

module.exports = router;
