// user routes here
const express = require('express');
const { authenticate } = require('../../../middlewares/authenticate');

const router = express.Router();

const {
  registerUser, loginUser, getUserById,
  updateUserById, verifyUser, logout
} = require('../controller');

router.post('/', registerUser);
router.post('/login', loginUser);
router.post('/logout', authenticate, logout);
router.post('/verify/:email', verifyUser);
router.get('/:id', getUserById);
router.put('/:id', updateUserById);
module.exports = router;
