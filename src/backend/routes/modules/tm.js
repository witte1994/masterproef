const express = require('express');
const router = express.Router();
const checkAuth = require('../../models/auth/check-auth');

const bpRoutes = require('../tm/bp');
const bsRoutes = require('../tm/bs');
const heartRoutes = require('../tm/heart');
const oxygenRoutes = require('../tm/oxygen');
const weightRoutes = require('../tm/weight');

router.use('/bp', bpRoutes);
router.use('/bs', bsRoutes);
router.use('/heart', heartRoutes);
router.use('/oxygen', oxygenRoutes);
router.use('/weight', weightRoutes);

module.exports = router;