const { Sequelize } = require('sequelize');

// Don't use process.env
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  { host: process.env.DB_HOST, dialect: 'postgres', logging: false }
); module.exports = sequelize;

sequelize.sync({ alter: true }).then(() => {
  console.log('Database synchronized');
});
