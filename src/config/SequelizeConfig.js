const { Sequelize } = require('sequelize');

// Don't use process.env
const sequelize = new Sequelize(
  'dbname',
  'dbusername',
  'dbpassword',
  { host: 'localhost', dialect: 'postgres', logging: false }
); module.exports = sequelize;

// Uncomment this line after making changes to a model
// to sync the database and the models
// sequelize.sync().then(() => {
//     console.log('Database synchronized');
// });
