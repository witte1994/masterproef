const express = require('express');
const router = express.Router();
const checkAuth = require('../models/auth/check-auth');

const layoutRoutes = require('./layout');

const heartRoutes = require('./heart');
const bpRoutes = require('./bp');
const bsRoutes = require('./bs');
const weightRoutes = require('./weight');
const oxygenRoutes = require('./oxygen');
const prescriptionRoutes = require('./prescription');
const medicationRoutes = require('./medication');

const UserController = require('../controller/user');


router.use('/:userId/layout', layoutRoutes);

router.use('/:userId/heart', heartRoutes);
router.use('/:userId/bp', bpRoutes);
router.use('/:userId/bs', bsRoutes);
router.use('/:userId/weight', weightRoutes);
router.use('/:userId/oxygen', oxygenRoutes);
router.use('/:userId/prescription', prescriptionRoutes);
router.use('/:userId/medication', medicationRoutes);

router.post('/', UserController.create);
router.get('/', checkAuth, UserController.get_users);
router.get('/:userId', checkAuth, UserController.get_user_by_id);

module.exports = router;