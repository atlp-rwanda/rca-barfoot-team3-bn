const jwt = require("jsonwebtoken")
const { User } = require("../modules/user/model")

async function authenticate(req, res, next) {
  let token = req?.headers?.authorization?.split(" ")[1]

  if (!token) return res.status(401).json({
    statusCode: 'UNAUTHENTICATED_ACCESS',
    errors: {
      request: [
        'You are not authenticated to use this request'
      ]
    }
  })

  try {
    let { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY)

    let user = await User.findByPk(userId)

    req.user = user.toJSON();

    next()
  } catch (error) {
    return res.status(401).json({
      statusCode: 'UNAUTHENTICATED_ACCESS',
      errors: {
        request: [
          'Invalid token'
        ]
      }
    })
  }
}

module.exports = {
  authenticate
}