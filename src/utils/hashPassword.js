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

module.exports = hashPassword;
