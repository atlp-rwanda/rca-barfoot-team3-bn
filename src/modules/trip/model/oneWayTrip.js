// Import sequelize and the accommodation model
const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/SequelizeConfig');
const { Accommodation } = require('../../accommodations/models'); // Update import statement
const { User } = require('../../user/model');

// Define the trip model
const OneWayTrip = sequelize.define('onewaytrips', {
  departure: DataTypes.STRING,
  destination: DataTypes.STRING,
  date: DataTypes.DATE,
  reason: DataTypes.STRING,
  created_by: DataTypes.INTEGER
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

OneWayTrip.hasOne(User, {
  foreignKey: 'created_by'
});

OneWayTrip.belongsTo(Accommodation, { foreignKey: 'accommodation_id' });

module.exports = {
  OneWayTrip
};
