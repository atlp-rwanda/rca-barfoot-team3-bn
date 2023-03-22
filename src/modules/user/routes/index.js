// user routes here
const express = require('express');

const router = express.Router();

const {
  registerUser, loginUser, initateResetPassword, resetPassword,
  getUserById, updateUserById, verifyUser
} = require('../controller');

router.post('/', registerUser);
router.post('/login', loginUser);
router.post('/initiate-reset-password', initateResetPassword);
router.post('/reset-password', resetPassword);
router.post('/verify/:email', verifyUser);
router.get('/:id', getUserById);
router.put('/:id', updateUserById);

module.exports = router;
