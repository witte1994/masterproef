const express = require('express');
const router = express.Router();
//const checkAuth = require('../models/auth/check-auth');

const ImportController = require('../controller/import');

router.post('/', ImportController.import);

module.exports = router;