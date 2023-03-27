// user routes here
const express = require('express');
const { authenticate } = require('../../../middlewares/authenticate');

const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserById,
  updateUserById,
  verifyUser,
  logout,
  initateResetPassword,
  resetPassword,
} = require('../controller');

/**
 * @swagger
 * /api/user/register:
 *  post:
 *    tags:
 *      - User
 *    description: Create an user
 *    parameters:
 *      - name: body
 *        in: body
 *        required: true
 *        schema:
 *          $ref: '#/definitions/User'
 *    responses:
 *      200:
 *        description: An user
 *      500:
 *        description: Server error
 */
router.post('/', registerUser);

/**
 * @swagger
 * /api/user/login:
 *  post:
 *    tags:
 *      - User
 *    description: login a user
 *    parameters:
 *      - name: body
 *        in: body
 *        required: true
 *        schema:
 *         type: object
 *         properties:
 *          email:
 *           type: string
 *          password:
 *           type: string
 *         required:
 *          - email
 *          - password
 *    responses:
 *      200:
 *        description: An user
 *      500:
 *        description: Server error
 */
router.post('/login', loginUser);
router.post('/logout', authenticate, logout);
router.post('/initiate-reset-password', initateResetPassword);
router.post('/reset-password', resetPassword);
router.post('/verify/:email', verifyUser);
router.get('/:id', getUserById);
router.put('/:id', updateUserById);

module.exports = router;
