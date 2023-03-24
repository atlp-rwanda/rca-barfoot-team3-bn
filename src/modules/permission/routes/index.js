const express = require('express');

const router = express.Router();
const PermissionController = require('../controller');

/**
 * @swagger
 * /api/permissions:
 *   post:
 *     summary: Create a new permission
 *     description: Create a new permission with the given name
 *     tags:
 *       - Permission
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Permission created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Permission created successfully
 *                 permission:
 *                   $ref: '#/definitions/Permission'
 *       400:
 *         description: BAD_REQUEST
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: BAD_REQUEST
 *                 errors:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example:
 *                         - Validation error: Name must be unique.
 *                         - Validation error: Name cannot be null.
 */

router.post('/', PermissionController.createPermission);

module.exports = router;
