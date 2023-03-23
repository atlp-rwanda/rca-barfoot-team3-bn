const { DataTypes } = require('sequelize');

const sequelize = require('../../../config/SequelizeConfig');

const ERoomType = {
  SMALL: 'SMALL',
  LARGE: 'LARGE',
  EXTRA_LARGE: 'EXTRA_LARGE'
};

const Room = sequelize.define('rooms', {
  accommodationId: DataTypes.NUMBER,
  type: DataTypes.ENUM(Object.keys(ERoomType)),
  name: DataTypes.STRING
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = {
  ERoomType,
  Room
};
