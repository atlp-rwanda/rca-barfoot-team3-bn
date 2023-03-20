const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
  try{
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

  res.status(201).send({ statusCode: 'CREATED', user });}
  catch(err){
    console.log(err)
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
        message: [
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
        message: [
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
 async function getUserById(req, res){
  try {
    const userId = req.params.id;
    const user = await User.findOne({ where: { id: userId } });
    
    if (!user) { 
      return res.status(404).json({ error: 'User not found' });
    }
    else{
      const userJson = user.get({ plain: true });
      const { password,created_at,updated_at, ...userProfile } =  userJson;

      return res.json(userProfile);
    }
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};
/**
 *
 * @param {*} req ExpressRequest
 * @param {*} res ExpressResponse
 * @returns {*}  Updateduser || user not found errors
 */
  async function updateUserById(req, res){
    try {
      const userId = req.params.id; 
      const { first_name, last_name,email ,gender,username, birthdate,preferred_language,preferred_currency, address, role, department, lineManager } = req.body; 
      
      const user = await User.findOne({ where: { id: userId } }); 
      
      if (!user) { 
        return res.status(404).json({ error: 'User not found' });
      }
      
      user.first_name = first_name;
      user.email = email;
      user.gender = gender;
      user.birthdate = birthdate;
      user.username = username;
      user.preferred_currency = preferred_currency;
      user.preferred_language = preferred_language
      user.address = address;
      user.role = role;
      user.department = department;
      user.lineManager = lineManager;
      
      await user.save(); 
      const userJson = user.get({ plain: true });
      const { password,created_at,updated_at, ...userProfile } =  userJson;
      return res.json(userProfile);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  updateUserById
};
