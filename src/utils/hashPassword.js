const bcrypt = require('bcrypt');

const saltRounds = 10;

/**
 *
 * @param {String} rawPassword
 * @returns {Promise<String>} hashedPassword
 */
async function hashPassword(rawPassword) {
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(rawPassword, salt);
}

async function passwordMatches(loginPassword, userPassword) {
  const salt = await bcrypt.genSalt(saltRounds);
  const loginHashed = bcrypt.hash(loginPassword, salt)
  if (loginHashed == userPassword)
    return true
  return false
}
module.exports = hashPassword;
