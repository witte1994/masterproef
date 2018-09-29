const express = require('express');
const router = express.Router();
const checkAuth = require('../models/auth/check-auth');

const LayoutController = require('../controller/layout');

router.post('/', LayoutController.save);

module.exports = router;