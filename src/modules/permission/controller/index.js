const Permission = require('../model');

class PermissionController {
  async createPermission(req, res) {
    const { name } = req.body;

    try {
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

  async getAllPermissions() {
    try {
      const permissions = await Permission.findAll({});

      return permissions;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = PermissionController;
