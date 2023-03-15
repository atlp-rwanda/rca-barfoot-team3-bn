const hashPassword = require("../../../utils/hashPassword")
const { validate, validateAsync } = require("../../../utils/validate")
const { User, registrationSchema } = require("../model")

async function registerUser(req, res) {
  let [passes, data, errors] = validate(req.body, registrationSchema)

  if (!passes) return res.status(400).json({
    statusCode: "BAD_REQUEST",
    errors
  })

  let emailExists = await validateAsync(data.email).exists("users:email")

  if (emailExists) {
    return res.status(400).json({
      statusCode: "BAD_REQUEST",
      errors: {
        email: [
          "This email is already taken"
        ]
      }
    })
  }

  data.password = await hashPassword(data.password)

  let user = await User.create(data)

  res.status(201).send({ statusCode: "CREATED", user })
}

module.exports = {
  registerUser
}