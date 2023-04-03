const { User } = require('../src/modules/user/model/index');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await User.sync({ alter: true }).then(() => {
      console.log('Database synchronized');
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
