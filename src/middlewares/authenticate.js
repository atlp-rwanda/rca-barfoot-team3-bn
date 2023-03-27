const jwt = require('jsonwebtoken');
const { User } = require('../modules/user/model');
/**
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {*} response
 */
async function authenticate(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        statusCode: 'UNAUTHENTICATED_ACCESS',
        errors: {
          request: [
            'You are not authenticated to use this request'
          ]
        }
      });
    }

    const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findByPk(userId);

    if (!user || user.token !== token) {
      return res.status(403).json({
        statusCode: 'FORBIDDEN_ACCESS',
        errors: {
          request: [
            'You are not authorized to use this request'
          ]
        }
      });
    }

    req.user = user.toJSON();

    next();
  } catch (error) {
    return res.status(401).json({
      statusCode: 'UNAUTHENTICATED_ACCESS',
      errors: {
        request: [
          'You are not authenticated to use this request'
        ]
      }
    });
  }
}

module.exports = {
  authenticate
};
