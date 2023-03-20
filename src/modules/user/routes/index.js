// user routes here
const express = require('express');

const router = express.Router();

const {
  registerUser, loginUser, getUserById, updateUserById
} = require('../controller');

router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/:id', getUserById);
router.put('/:id', updateUserById);
module.exports = router;
