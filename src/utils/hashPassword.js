const bcrypt = require("bcrypt")
const saltRounds = 10

async function hashPassword(rawPassword) {
  let salt = await bcrypt.genSalt(saltRounds)
  return bcrypt.hash(rawPassword, salt)
}

module.exports = hashPassword