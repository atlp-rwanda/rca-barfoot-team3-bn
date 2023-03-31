const Role = require('../modules/role/model');
const { User } = require('../modules/user/model');

/**
 * Middleware function to check if user is a Super Admin.
 * @param {*} req - The HTTP request object.
 * @param {*} res - The HTTP response object.
 * @param {*} next - The callback function to move to the next middleware.
 * @returns {*} If user is a Super Admin, moves on to the next middleware.
 *  Otherwise, sends an error response.
 */
async function checkSuperAdmin(req, res, next) {
  const userId = req.user.id;

  try {
    const user = await User.findOne({
      where: { id: userId },
      include: [{ model: Role }],
    });

    const roles = user.Roles.map((role) => role.name);
    req.user = { ...req.user, roles };
    if (!roles.includes('Super Administrator')) {
      return res.status(403).json({ message: 'Only super admin can access this service' });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
}

module.exports = { checkSuperAdmin };
