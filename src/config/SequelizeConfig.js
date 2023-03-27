const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  { host: process.env.DB_HOST, dialect: 'postgres', logging: false }
); module.exports = sequelize;

// Uncomment this line after making changes to a model
// to sync the database and the models
// sequelize.sync().then(() => {
//     console.log('Database synchronized');
// });
