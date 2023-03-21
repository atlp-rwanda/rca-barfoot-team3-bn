const { DataTypes } = require('sequelize');
const { Accommodation } = require('.');

const sequelize = require('../../../config/SequelizeConfig');

const ERoomType = {
  SMALL: "SMALL",
  LARGE: "LARGE",
  EXTRA_LARGE: "EXTRA_LARGE"
}

const Room = sequelize.define('rooms', {
  accomodation: DataTypes.NUMBER,
  type: DataTypes.ENUM(Object.keys(ERoomType)),
  image_path: DataTypes.STRING
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

Room.hasOne(Accommodation, {
  foreignKey: 'accomodation'
});

module.exports = {
  Room
};
