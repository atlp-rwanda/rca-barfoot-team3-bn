const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/SequelizeConfig");
const { OneWayTrip } = require("./oneWayTrip");
const { User } = require("../../user/model");

const Request = sequelize.define("requests", {
  status: DataTypes.ENUM("PENDING", "ACCEPTED", "ACTIVE", "DECLINED", "CLOSED")
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})

OneWayTrip.belongsTo(Request)
Request.hasOne(OneWayTrip)

User.hasMany(Request)
Request.belongsTo(User)

module.exports = {
  Request
}