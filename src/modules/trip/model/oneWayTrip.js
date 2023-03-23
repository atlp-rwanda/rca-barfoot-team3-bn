// Import sequelize and the accommodation model
const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/SequelizeConfig');
const { Accommodation } = require('./../../accommodations/models'); // Update import statement
const { User } = require('../../user/model');

// Define the trip model
const OneWayTrip = sequelize.define('OneWayTrip', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    departure: {
        type: DataTypes.STRING,
        allowNull: false
    },
    destination: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tripAccommodation: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Accommodation,
            key: 'id'
        }
    }
});
OneWayTrip.belongsTo(User);
OneWayTrip.hasOne(User, {
    foreignKey: 'created_by'
});


OneWayTrip.belongsTo(Accommodation, { foreignKey: 'accommodationId' }); // Update foreign key name
