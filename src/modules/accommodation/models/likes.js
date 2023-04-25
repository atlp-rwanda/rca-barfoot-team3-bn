const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/SequelizeConfig');


const Like = sequelize.define('likes', {
     accommodation_id: DataTypes.INTEGER,
     user_id: DataTypes.INTEGER,
     liked: DataTypes.BOOLEAN
}, {
     timestamps: true,
     createdAt: 'created_at',
     updatedAt: 'updated_at'
});

module.exports = {
     Like
}