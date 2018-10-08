const express = require('express');
const router = express.Router();
const checkAuth = require('../models/auth/check-auth');

const MedicationController = require('../controller/medication');

router.get('/:start&:end', checkAuth, MedicationController.get_by_date);
router.get('/small/:start&:end', checkAuth, MedicationController.get_small_by_date);

router.post('/', MedicationController.add);

router.patch('/threshold', checkAuth, MedicationController.update_threshold);
router.get('/threshold', checkAuth, MedicationController.get_threshold);

module.exports = router;