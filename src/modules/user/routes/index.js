// user routes here
const express = require('express');

const router = express.Router();

const { registerUser, loginUser, initateResetPassword, resetPassword } = require('../controller');

router.post('/', registerUser);
router.post('/login', loginUser);
router.post('/initiate-reset-password', initateResetPassword);
router.post('/reset-password', resetPassword);
module.exports = router;
