/**
 * @swagger
 * definitions:
 *   Role:
 *     properties:
 *       id:
 *         type: integer
 *       name:
 *         type: string
 *     required:
 *       - name
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/SequelizeConfig');

const Role = sequelize.define('Role', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'roles',
  freezeTableName: true
});

Role.associate = (models) => {
  Role.belongsToMany(models.Permission, { through: 'RolePermission' });
  Role.belongsToMany(models.User, { through: 'UserRole' });
};

module.exports = Role;
