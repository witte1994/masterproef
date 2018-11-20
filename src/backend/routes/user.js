const express = require('express');
const router = express.Router();
const checkAuth = require('../models/auth/check-auth');

const layoutRoutes = require('./layout');

const prescriptionRoutes = require('./prescription');
const allergyRoutes = require('./allergy');
const vaccinationRoutes = require('./vaccination');
const medicationRoutes = require('./medication');

const UserController = require('../controller/user');

router.use('/:userId/layout', layoutRoutes);

router.use('/:userId/prescription', prescriptionRoutes);
router.use('/:userId/allergy', allergyRoutes);
router.use('/:userId/vaccination', vaccinationRoutes);
router.use('/:userId/medication', medicationRoutes);

router.post('/', UserController.create);
router.get('/', checkAuth, UserController.get_users);
router.get('/:userId', checkAuth, UserController.get_user_by_id);

module.exports = router;