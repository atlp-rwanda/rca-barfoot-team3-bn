const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'postgres',
  'postgres',
  'KWdFegey5wuSrP2',
  { host: 'db.ndwotyychzlbilxjrnso.supabase.co', dialect: 'postgres', logging: false }
); module.exports = sequelize;

// Uncomment this line after making changes to a model
// to sync the database and the models
sequelize.sync().then(() => {
  console.log('Database synchronized');
});
