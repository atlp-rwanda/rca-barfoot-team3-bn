const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'barefoot-nomad',
  'postgres',
  'password',
  { host: 'localhost', dialect: 'postgres', logging: false }
); module.exports = sequelize;

// Uncomment this line after making changes to a model
// to sync the database and the models
sequelize.sync().then(() => {
  console.log('Database synchronized');
});
