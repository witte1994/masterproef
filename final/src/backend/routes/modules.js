const express = require('express');
const router = express.Router();
const checkAuth = require('../models/auth/check-auth');

const ModuleController = require('../controller/modules');

router.get('/', ModuleController.get_module_list);

module.exports = router;