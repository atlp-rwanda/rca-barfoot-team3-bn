const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/SequelizeConfig");
const Role = require("../../role/model");

const Permission = sequelize.define('Permission', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'permissions',
});

Role.belongsToMany(Permission, { through: 'RolePermission' });
Permission.belongsToMany(Role, { through: 'RolePermission' });

module.exports = Permission;
