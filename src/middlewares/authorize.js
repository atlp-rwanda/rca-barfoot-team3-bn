/**
 *
 * @param {String[]} roles the role types allowd to access this resource
 * @returns {*} a middleware function
 */
function authorize(...roles) {
  return function middleware(req, res, next) {
    if (roles.some((role) => req.user.roles.includes(role))) next();
    else {
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
