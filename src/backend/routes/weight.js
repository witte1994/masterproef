const express = require('express');
const router = express.Router();

const WeightController = require('../controller/weight');

router.get('/:start&:end', WeightController.get_by_date);
router.get('/small/:start&:end', WeightController.get_small_by_date);

router.post('/', WeightController.add);

router.post('/threshold', WeightController.set_threshold);
router.patch('/threshold', WeightController.update_threshold);
router.get('/threshold', WeightController.get_threshold);

module.exports = router;