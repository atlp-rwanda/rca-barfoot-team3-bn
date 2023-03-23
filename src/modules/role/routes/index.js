// role routes here
const express = require('express');
const Permission = require('../../permission/model');
const RoleController = require('../../role/controller');
const Role = require('../model');

const router = express.Router();
const roleController = new RoleController();

router.post('/', roleController.createRole);

router.post('/assign-permissions', roleController.assignPermissions);

router.put('/revoke-permission/:roleId/:permissionId', roleController.revokePermission);


module.exports = router;