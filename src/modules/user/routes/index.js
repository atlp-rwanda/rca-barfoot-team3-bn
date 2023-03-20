// user routes here
const express = require('express');

const router = express.Router();

const { registerUser, loginUser, verifyUser } = require('../controller');

router.post('/', registerUser);
router.post('/login', loginUser);
router.post('/verify/:email', verifyUser);
module.exports = router;
