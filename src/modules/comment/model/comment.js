const sequelize = require("sequelize");
const { Booking } = require("../../booking/models");
const { User } = require("../../user/model");

const Comment = sequelize.define('comments', {
    message: DataTypes.TEXT,
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

User.hasMany(Comment);
Comment.belongsTo(User);

Booking.hasMany(Comment);
Comment.belongsTo(Booking);

module.exports = Comment;
