
/**
 * 
 * @param {String[]} roles the role types allowd to access this resource
 * @returns a middleware function 
 */
export function only(...roles) {
  return function (req, res, next) {
    if (roles.includes(req.user.role)) next()
    else return res.send({
      statusCode: 'UNAUTHORIZED',
      errors: {
        request: [
          'You are not authorized to use this request'
        ]
      }
    })
  }
}