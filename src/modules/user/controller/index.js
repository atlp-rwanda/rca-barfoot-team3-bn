const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const generateRandOTP = require('../../../utils/generator');
const hashPassword = require('../../../utils/hashPassword');
const { validate, validateAsync } = require('../../../utils/validate');
const { User, registrationSchema } = require('../model');

/**
 *
 * @param {*} req ExpressRequest
 * @param {*} res ExpressResponse
 * @returns {*} verification code || validation errors
 */

const sendEmails = (receiverEmail, verificationCode) => {
  console.log('Receiver email ', receiverEmail);
  const Transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL,
      pass: process.env.MAIL_PASS,
    },
  });

  const message = `Please follow the given link to verify your email 
                 <a href=${process.env.BASE_URL}/users/verify/${receiverEmail}>Click</>`;

  const mailOptions = {
    to: receiverEmail,
    subject: 'Barefoot Nomad Email Verification',
    html: `<p>Your verification code is ${verificationCode}</p>
          <p>${message}</p>`
  };

  Transport.sendMail(mailOptions, (error, info) => {
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
  const randOTP = await generateRandOTP();
  console.log('Random OTp ', randOTP);
  sendEmails(data.email, randOTP);
  const user = await User.create({
    ...data,
    verification_code: randOTP,
    verified: false,
    verification_code_expiry_date: new Date(Date.now() + (24 * 60 * 60 * 1000))
  });
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
  return res.status(201).send({ statusCode: 'CREATED', token, userEmail });
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
  console.log('user ', user.toJSON());
  console.log('user code ', user.verification_code, ' code ', req.body.code);
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
  await User.update(
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
  verifyUser
};
