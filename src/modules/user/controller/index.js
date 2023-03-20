const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const hashPassword = require('../../../utils/hashPassword');
const { validate, validateAsync } = require('../../../utils/validate');
const { User, registrationSchema } = require('../model');

/**
 *
 * @param {*} req ExpressRequest
 * @param {*} res ExpressResponse
 * @returns {*} created user || validation errors
 */
async function registerUser(req, res) {
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
        email: [
          'This email is already taken'
        ]
      }
    });
  }

  data.password = await hashPassword(data.password);

  const user = await User.create(data);

  res.status(201).send({ statusCode: 'CREATED', user });
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
      errors: {
        email: [
          'Invalid credentials'
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
  const userEmail = user.email;
  sendEmails(userEmail);
  return res.status(201).send({ statusCode: 'CREATED', token, userEmail });
}

  /**
 *
 * @param {*} req ExpressRequest
 * @param {*} res ExpressResponse
 * @returns {*} token and useremail || validation errors
 */
   // a function to reset password
  const initateResetPassword = (req, res) => {
    const { email } = req.body;
    const Transport = nodemailer.createTransport({
      service: process.env.MAIL_SERVICE,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
      } 
    });
    const mailOptions = {
      to: email,
      subject: 'Barefoot Nomad Reset password',
      html: `<a href= 'http://localhost:5000/api/v1/users/reset-password'>Click to reset </a>`,
    };

    Transport.sendMail(mailOptions, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Message sent successfully');
      }
    });
    return res.status(200).json({
      statusCode: 'OK',
      message: 'Email sent successfully'

    });
  };

  /**
 * Resets the password for a given user
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
          'User not found'
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
    

module.exports = {
  registerUser,
  initateResetPassword,
  resetPassword,
  loginUser
};