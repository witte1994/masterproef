const express = require('express');
const router = express.Router();
const checkAuth = require('../models/auth/check-auth');

const layoutRoutes = require('./layout');

const prescriptionRoutes = require('./modules/prescription');
const allergyRoutes = require('./modules/allergy');
const vaccinationRoutes = require('./modules/vaccination');
const medicationRoutes = require('./modules/medication');

const PatientController = require('../controller/patient');

router.use('/:pId/layout', layoutRoutes);

router.use('/:pId/prescription', prescriptionRoutes);
router.use('/:pId/allergy', allergyRoutes);
router.use('/:pId/vaccination', vaccinationRoutes);
router.use('/:pId/medication', medicationRoutes);

router.post('/', PatientController.create);
router.get('/', checkAuth, PatientController.get_patients);
router.get('/:pId', checkAuth, PatientController.get_patient_by_id);

module.exports = router;