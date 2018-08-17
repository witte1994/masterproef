const express = require('express');
const router = express.Router();

const MedicationController = require('../controller/medication');

router.get('/:start&:end', MedicationController.get_by_date);
router.get('/small/:start&:end', MedicationController.get_small_by_date);

router.post('/', MedicationController.add);

router.post('/threshold', MedicationController.set_threshold);
router.patch('/threshold', MedicationController.update_threshold);
router.get('/threshold', MedicationController.get_threshold);

module.exports = router;