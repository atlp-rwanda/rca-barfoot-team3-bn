// user routes here
const express = require('express');

const router = express.Router();

const { registerUser } = require('../controller');

router.post('/', registerUser);

module.exports = router;
