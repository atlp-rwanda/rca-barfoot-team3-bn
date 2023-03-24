/* eslint-disable camelcase */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const hashPassword = require('../../../utils/hashPassword');
const generateRandOTP = require('../../../utils/generator');
const { validate, validateAsync } = require('../../../utils/validate');
const { User, registrationSchema, updateSchema } = require('../model');
/**
 *
 * @param {*} req ExpressRequest
 * @param {*} res ExpressResponse
 * @returns {*} verification code || validation errors
 */

const sendEmails = (receiverEmail, verificationCode) => {
  const Transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_HOST_PORT,
    secure: process.env.MAIL_HOST_SECURE,
    auth: {
      user: process.env.MAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const message = `<a href=http://localhost:${process.env.PORT}/api/v1/users/verify/${receiverEmail}>Click</a>`;

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
    } else {
      console.log('Message sent');
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
          email: [
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
          email: [
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
    res.status(201).send({ statusCode: 'CREATED', user });
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
  return res.status(201).send({ statusCode: 'CREATED', token, userEmail });
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
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const field in data) {
      user[field] = data[field];
    }
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
  if (user.verified) {
    return res.status(400).json({
      statusCode: 'BAD_REQUEST',
      errors: {
        email: [
          'User already verified'
        ]
      }
    });
  }
  if (user.verification_code_expiry_date < new Date()) {
    return res.status(400).json({
      statusCode: 'BAD_REQUEST',
      errors: {
        email: [
          'Verification code expired'
        ]
      }
    });
  }
  if (user.verification_code !== req.body.code) {
    return res.status(400).json({
      statusCode: 'BAD_REQUEST',
      errors: {
        email: [
          'Invalid verification code'
        ]
      }
    });
  }
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

module.exports = {
  registerUser,
  loginUser,
  verifyUser,
  getUserById,
  updateUserById
};
