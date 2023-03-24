// role routes here
const express = require('express');
const RoleController = require('../../role/controller');

const router = express.Router();
const roleController = new RoleController();

/**
 * @swagger
 * /api/role:
 *  post:
 *    tags:
 *      - Role
 *    summary: Create a new role
 *    description: Create a new role with the specified name
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: body
 *        description: Role name
 *        schema:
 *          type: object
 *          properties:
 *            name:
 *              type: string
 *        required:
 *          - name
 *    produces:
 *      - application/json
 *    responses:
 *      201:
 *        description: Role created successfully
 *        schema:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              example: Role created successfully
 *            data:
 *              $ref: '#/definitions/Role'
 *      400:
 *        description: Bad request
 *        schema:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              example: BAD_REQUEST
 *            errors:
 *              type: object
 *              properties:
 *                name:
 *                  type: array
 *                  items:
 *                    type: string
 *                  example: ['Role name must be unique']
 *      500:
 *        description: Internal server error
 */
router.post('/', roleController.createRole);

/**
 * @swagger
 * /api/role/assign-permissions:
 *   post:
 *     tags:
 *       - Role
 *     description: Assign permissions to a role
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         description: JSON object containing roleId and an array of permissionIds
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             roleId:
 *               type: integer
 *             permissionIds:
 *               type: array
 *               items:
 *                 type: integer
 *         example:
 *           roleId: 1
 *           permissionIds: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Permissions assigned successfully
 *       400:
 *         description: Invalid request body or parameters
 *       404:
 *         description: Role or permission not found
 *       500:
 *         description: Internal server error
 */
router.post('/assign-permissions', roleController.assignPermissions);

/**
 * @swagger
 * /roles/revoke-permission/{roleId}/{permissionId}:
 *   put:
 *     summary: Revoke permission from role
 *     description: Revoke permission from a role by removing the permission from the role's list of permissions
 *     tags:
 *       - Role
 *     parameters:
 *       - name: roleId
 *         in: path
 *         description: ID of the role to revoke permission from
 *         required: true
 *         type: integer
 *       - name: permissionId
 *         in: path
 *         description: ID of the permission to revoke from the role
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Permission revoked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Role or Permission not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

router.put('/revoke-permission/:roleId/:permissionId', roleController.revokePermission);


module.exports = router;