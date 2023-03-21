const express = require('express');

const router = express.Router();

const { AccomodationsController } = require('../controllers');

router.post('/', AccomodationsController.create);

module.exports = router;
