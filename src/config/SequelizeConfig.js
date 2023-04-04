const { Sequelize } = require('sequelize');

// Don't use process.env
const sequelize = new Sequelize(
  'postgres',
  'postgres',
  'KWdFegey5wuSrP2',
  { host: 'db.ndwotyychzlbilxjrnso.supabase.co', dialect: 'postgres', logging: false }
); module.exports = sequelize;

sequelize.sync({ alter: true }).then(() => {
  console.log('Database synchronized');
});
