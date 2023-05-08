/* eslint-disable camelcase */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const hashPassword = require('../../../utils/hashPassword');
const generateRandOTP = require('../../../utils/generator');
const { validate, validateAsync } = require('../../../utils/validate');
const Role = require('../../role/model');
const { User, registrationSchema, updateSchema } = require('../model');
const Transport = require('../../../utils/transport');
/**
 *
 * @param {*} req ExpressRequest
 * @param {*} res ExpressResponse
 * @returns {*} verification code || validation errors
 */

const sendEmails = (receiverEmail, verificationCode) => {
  // const message = `<a href=http://localhost:${process.env.PORT}/api/v1/users/verify/${receiverEmail}>Click</a>`;
  const message = `<a href=http://localhost:8080/verify?code=${verificationCode}&email=${receiverEmail}>Click</a>`;

  const mailOptions = {
    to: receiverEmail,
    subject: 'Barefoot Nomad Email Verification',
    html: `<p>Your verification code is ${verificationCode}</p>
          <p>Please follow the given link to verify your email</p>
          <p>${message}</p>`
  };

  Transport.sendMail(mailOptions, (error) => {
    if (error) {
      console.log(error);
    }
  });
};

/**
 *
 * @param {*} req ExpressRequest
 * @param {*} res ExpressResponse
 * @returns {*} created user || validation errors
 */
async function registerUser(req, res) {
  try {
    const [passes, data, errors] = validate(req.body, registrationSchema);

    if (!passes) {
      return res.status(400).json({
        statusCode: 'BAD_REQUEST',
        errors
      });
    }

    const emailExists = await validateAsync(data.email).exists('users:email');
    if (emailExists) {
      return res.status(400).json({
        statusCode: 'BAD_REQUEST',
        errors: {
          message: [
            'This email is already taken'
          ]
        }
      });
    }

    const usernameExists = await validateAsync(data.username).exists('users:username');

    if (usernameExists) {
      return res.status(400).json({
        statusCode: 'BAD_REQUEST',
        errors: {
          message: [
            'This username is already taken'
          ]
        }
      });
    }

    data.password = await hashPassword(data.password);
    const randOTP = await generateRandOTP();
    sendEmails(data.email, randOTP);
    const user = await User.create({
      ...data,
      verification_code: randOTP,
      verified: false,
      verification_code_expiry_date: new Date(Date.now() + (24 * 60 * 60 * 1000))
    });
    const { verification_code, ...userData } = user;

    res.status(201).send({ statusCode: 'CREATED', userData });
  } catch (err) {
    console.log(err);
  }
}

/**
 *
 * @param {*} req ExpressRequest
 * @param {*} res ExpressResponse
 * @returns {*} token and useremail || validation errors
 */
async function loginUser(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({
    where: {
      email
    }
  });

  if (!user) {
    return res.status(400).json({
      statusCode: 'BAD_REQUEST',
      errors: 'Invalid credentials'
    });
  }
  if (!user.verified) {
    return res.status(400).json({
      statusCode: 'BAD_REQUEST',
      errors: {
        email: [
          'This user is not Verified'
        ]
      }
    });
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    return res.status(400).json({
      statusCode: 'BAD_REQUEST',
      errors: {
        password: [
          'Invalid credentials'
        ]
      }
    });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY);
  user.token = token;
  await user.save();
  return res.status(201).send({ statusCode: 'CREATED', token ,user});
}
/**
 *
 * @param {*} req ExpressRequest
 * @param {*} res ExpressResponse
 * @returns {*}  user || user not found errors
 */
async function logout(req, res) {
  try {
    await User.update({ token: null }, { where: { id: req.user.id } });
    res.status(200).send({ message: 'Logged out successfully', token: null });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
}
/**
 *
 * @param {*} req ExpressRequest
 * @param {*} res ExpressResponse
 * @returns {*}  user || user not found errors
 */
async function getUserById(req, res) {
  try {
    const userId = req.params.id;
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userJson = user.get({ plain: true });
    const {
      password, created_at, updated_at, ...userProfile
    } = userJson;

    return res.json(userProfile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
}
/**
 *
 * @param {*} req ExpressRequest
 * @param {*} res ExpressResponse
 * @returns {*}  Updateduser || user not found errors
 */
async function updateUserById(req, res) {
  try {
    const [passes, data, errors] = validate(req.body, updateSchema);

    if (!passes) {
      return res.status(400).json({
        statusCode: 'BAD_REQUEST',
        errors
      });
    }
    const userId = req.params.id;

    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    Object.keys(data).forEach((key) => {
      user[key] = data[key];
    });
    await user.save();
    const userJson = user.get({ plain: true });
    const {
      password, created_at, ...userProfile
    } = userJson;
    return res.json(userProfile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
}

/**
 *
 * @param {*} req ExpressRequest
 * @param {*} res ExpressResponse
 * @returns {*} token and useremail || validation errors
 */
async function verifyUser(req, res) {
  const { email } = req.params;
  const { code } = req.body; // Added code to destructure code from req.body
  if (!code) { // Check if code is provided
    return res.status(400).json({
      statusCode: 'BAD_REQUEST',
      errors: {
        message: [
          'Verification code is required' // Error message for missing code
        ]
      }
    });
  }

  const user = await User.findOne({
    where: {
      email
    }
  });
  if (!user) {
    return res.status(400).json({
      statusCode: 'BAD_REQUEST',
      errors: {
        message: [
          'Invalid credentials'
        ]
      }
    });
  }
  if (user.verified) {
    return res.status(400).json({
      statusCode: 'BAD_REQUEST',
      errors: {
        message: [
          'User already verified'
        ]
      }
    });
  }
  if (user.verification_code_expiry_date < new Date()) {
    return res.status(400).json({
      statusCode: 'BAD_REQUEST',
      errors: {
        message: [
          'Verification code expired'
        ]
      }
    });
  }
  if (user.verification_code !== code) { // Updated to use code from req.body
    console.log('user', user.verification_code);
    return res.status(400).json({
      statusCode: 'BAD_REQUEST',
      errors: {
        message: [
          'Invalid verification code'
        ]
      }
    });
  }
  console.log('here');

  if (user.verification_code === code) { // Updated to use code from req.body
    await user.update(
      {
        verified: true,
        verification_code_expiry_date: null,
        verification_code: null
      },
      { where: { email } }
    );
    return res.status(200).json({
      statusCode: 'OK',
      user
    });
  }
}

/**
 *
 * @param {*} req ExpressRequest
 * @param {*} res ExpressResponse
 * @returns {*} token and useremail || validation errors
 */
// a function to reset password
const initateResetPassword = (req, res) => {
  const { email } = req.body.email;
  const mailOptions = {
    to: email,
    subject: 'Barefoot Nomad Reset password',
    html: `<p>Welcome to barefoot Nomad, Click the link below to reset password.</p><a href='http://localhost:8080/reset-password?email=${email}'><b>Click to reset</b> </a>`,
  };

  Transport.sendMail(mailOptions, (error) => {
    if (error) {
      console.log(error);
    }
  });
  return res.status(200).json({
    statusCode: 'OK',
    message: 'Email sent successfully'
  });
};

/**
 *
 * @param {*} req ExpressRequest
 * @param {*} res ExpressResponse
 * @returns {*} success message or error message
 */
async function resetPassword(req, res) {
  const { email, currentPassword, newPassword } = req.body;

  const user = await User.findOne({
    where: {
      email
    }
  });

  if (!user) {
    return res.status(400).json({
      statusCode: 'BAD_REQUEST',
      errors: {
        email: [
          'Try again later'
        ]
      }
    });
  }

  const passwordMatches = await bcrypt.compare(currentPassword, user.password);
  if (!passwordMatches) {
    return res.status(400).json({
      statusCode: 'BAD_REQUEST',
      errors: {
        currentPassword: [
          'Incorrect password'
        ]
      }
    });
  }

  const newPasswordHash = await bcrypt.hash(newPassword, 10);

  await user.update({ password: newPasswordHash });

  return res.status(200).send({ message: 'Password reset successfully' });
}

/**
 *
 * @param {*} req ExpressRequest
 * @param {*} res ExpressResponse
 * @returns {*} assign a role to a user
 */
async function assignRoles(req, res) {
  const { email, roleIds } = req.body;
  try {
    if (!(email || roleIds)) {
      return res.status(400).json({ message: 'Email and roleIds are required' });
    }
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const roles = await Role.findAll({ where: { id: roleIds } });

    if (!roles || roles.length === 0) {
      return res.status(404).json({ message: 'No roles found with the provided ids' });
    }

    await user.setRoles(roles);
    return res.status(200).json({ message: 'Roles assigned successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  registerUser,
  initateResetPassword,
  resetPassword,
  loginUser,
  verifyUser,
  getUserById,
  updateUserById,
  assignRoles,
  logout
};
