/**
 *
 * @returns {Promise<String>} generated OTP
 */
async function generateRandOTP() {
  const len = 8;
  let randStr = '';
  for (let i = 0; i < len; i += 1) {
    const ch = Math.floor((Math.random() * 10) + 1);
    randStr += ch;
  }
  return randStr;
}

module.exports = generateRandOTP;
