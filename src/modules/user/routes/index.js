// user routes here
const express = require('express');

const router = express.Router();

const { registerUser, loginUser, resetPassword } = require('../controller');

router.post('/', registerUser);
router.post('/login', loginUser);
router.post('/reset-password', resetPassword);
module.exports = router;