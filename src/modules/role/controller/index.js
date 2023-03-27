/**
 * Role Controller class
 */
const Permission = require('../../permission/model');
const Role = require('../model');
/**
 * Controller class for managing Roles.
 */
class RoleController {
  /**
   * Create a new role
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object with created role
   */
  static async createRole(req, res) {
    const { name } = req.body;

    try {
      const existingRole = await Role.findOne({ where: { name } });

      if (existingRole) {
        return res.status(400).json({
          message: 'BAD_REQUEST',
          errors: {
            name: [
              'Validation error: Name must be unique.'
            ]
          }
        });
      }

      const role = await Role.create({
        name
      });

      return res.status(201).json({
        message: 'Role created successfully',
        data: role
      });
    } catch (error) {
      return res.status(400).json({
        message: 'BAD_REQUEST',
        errors: {
          name: [
            error.message
          ]
        }
      });
    }
  }

  /**
   * Retrieve all roles
   *
   * @function
   * @async
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} Response object with roles data or error message
   */
  static async getAllRoles(req, res) {
    try {
      const roles = await Role.findAll({});
      return res.status(200).json({
        message: 'Roles retrieved successfully',
        data: roles
      });
    } catch (error) {
      return res.status(500).json({
        message: 'INTERNAL_SERVER_ERROR',
        errors: {
          name: [
            error.message
          ]
        }
      });
    }
  }

  /**
   * Assign permissions to a role
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object with success message
   */
  static async assignPermissions(req, res) {
    const { roleId, permissionIds } = req.body;

    try {
      const role = await Role.findOne({ where: { id: roleId } });

      if (!role) {
        return res.status(404).send({ message: 'Role not found' });
      }
      const permissions = await Permission.findAll({ where: { id: permissionIds } });

      if (!permissions || permissions.length === 0) {
        return res.status(404).send({ message: 'Permission not found' });
      }

      await role.setPermissions(permissions);
      return res.status(200).send({ message: 'Permissions assigned successfully' });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

  /**
   * Revoke permission from a role
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object with success message
   */
  static async revokePermission(req, res) {
    try {
      const { roleId, permissionId } = req.body;

      // Find the role
      const role = await Role.findByPk(roleId);
      if (!role) {
        return res.status(404).json({ error: 'Role not found' });
      }

      // Find the permission
      const permission = await Permission.findByPk(permissionId);
      if (!permission) {
        return res.status(404).json({ error: 'Permission not found' });
      }

      // Remove the permission from the role's list of permissions
      await role.removePermission(permission);

      return res.status(200).json({ message: 'Permission revoked successfully' });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = RoleController;
