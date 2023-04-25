const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/SequelizeConfig');

const Like = sequelize.define('likes', {
  accommodationId: DataTypes.INTEGER,
  userId: DataTypes.INTEGER,
  liked: DataTypes.BOOLEAN
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = {
  Like
};
