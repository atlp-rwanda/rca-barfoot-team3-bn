// user routes here
const express = require('express');
const { authenticate } = require('../../../middlewares/authenticate');

const router = express.Router();

const {
  registerUser, loginUser, getUserById,
  updateUserById, verifyUser, logout, initateResetPassword, resetPassword
} = require('../controller');

router.post('/', registerUser);
router.post('/login', loginUser);
router.post('/logout', authenticate, logout);
router.post('/initiate-reset-password', initateResetPassword);
router.post('/reset-password', resetPassword);
router.post('/verify/:email', verifyUser);
router.get('/:id', getUserById);
router.put('/:id', updateUserById);

module.exports = router;
