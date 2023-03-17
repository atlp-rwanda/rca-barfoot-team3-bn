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

  const sendEmails = (email) => {
    const verificationCode = Math.floor(1000 + Math.random() * 9000);

    const Transport = nodemailer.createTransport({
      service: process.env.MAIL_SERVICE,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
      }
    });
    let mailOptions;
    mailOptions = {
      to: email,
      subject: 'Email confirmation',
      html: `<h3>Your verification code is ${verificationCode}</h3>`
    };

    Transport.sendMail(mailOptions, (error, response) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Message sent');
      }
    });
  };

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

module.exports = {
  registerUser,
  loginUser
};
