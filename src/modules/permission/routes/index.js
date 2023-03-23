const express = require('express');
const router = express.Router();
const PermissionController = require('../../permission/controller');

const permissionController = new PermissionController();

router.post('/', permissionController.createPermission)

module.exports = router;