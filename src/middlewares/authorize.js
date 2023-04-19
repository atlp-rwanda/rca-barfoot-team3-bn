/**
 *
 * @param {String[]} roles the role types allowd to access this resource
 * @returns {*} a middleware function
 */
function authorize(...roles) {
  return function middleware(req, res, next) {
    const hasValidRole = roles.some((role) => {
      const userRoleIndex = req.user.roles.findIndex((userRole) => userRole.name === role);
      return userRoleIndex !== -1;
    });

    if (hasValidRole) {
      next();
    } else {
      return res.status(401).json({
        statusCode: 'UNAUTHORIZED_ACCESS',
        errors: {
          request: [
            'You are not authorized to use this request'
          ]
        }
      });
    }
  };
}

module.exports = {
  authorize
};
