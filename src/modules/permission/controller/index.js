const Permission = require('../model');

/**
 * Controller class for managing Permissions.
 */
class PermissionController {
  /**
   * Create a new permission.
   * @param {*} req - The request object.
   * @param {*} res - The response object.
   * @returns {Promise<Object>} A Promise to resolve the newly created permission object.
   * @throws {Error} If there's an error creating the permission.
   */
  static async createPermission(req, res) {
    const { name } = req.body;

    try {
      const existingPermission = await Permission.findOne({ where: { name } });

      if (existingPermission) {
        return res.status(400).json({
          message: 'BAD_REQUEST',
          errors: {
            name: [
              'Validation error: Name must be unique.'
            ]
          }
        });
      }

      const permission = await Permission.create({ name });

      return res.status(201).json({
        message: 'Permission created successfully',
        permission
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
   * Retrieve all permissions from the database.
   * @param {*} req - The request object.
   * @param {*} res - The response object.
   * @returns {Promise<Array<Permission>>} A Promise resolving to an array of Permission objects.
   * @throws {Error} If there's an error retrieving the permissions.
   */
  static async getAllPermissions(req, res) {
    try {
      const permissions = await Permission.findAll({});

      return res.status(200).json({
        message: 'Permissions retrieved successfully',
        data: permissions
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = PermissionController;
