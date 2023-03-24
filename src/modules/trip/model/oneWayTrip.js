// Import sequelize and the accommodation model
const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/SequelizeConfig');
const { Accommodation } = require('./../../accommodations/models'); // Update import statement
const { User } = require('../../user/model');

// Define the trip model
const OneWayTrip = sequelize.define('OneWayTrip', {
    
    departure: DataTypes.STRING,
    destination:  DataTypes.STRING,
    date: DataTypes.DATE,   
    reason: DataTypes.STRING,
    tripAccommodation: DataTypes.NUMBER,
    // created_by: DataTypes.NUMBER,
    
});
OneWayTrip.belongsTo(User);
OneWayTrip.hasOne(User, {
    foreignKey: 'created_by'
});


OneWayTrip.belongsTo(Accommodation, { foreignKey: 'accommodationId' }); // Update foreign key name

module.exports = {
    OneWayTrip
}