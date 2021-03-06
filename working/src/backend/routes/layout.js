const express = require('express');
const router = express.Router();
const checkAuth = require('../models/auth/check-auth');

const LayoutController = require('../controller/layout');

router.post('/', LayoutController.save);
router.get('/:cId', LayoutController.get);

module.exports = router;