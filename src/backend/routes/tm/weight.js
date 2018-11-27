const express = require('express');
const router = express.Router();
const checkAuth = require('../../models/auth/check-auth');

const WeightController = require('../../controller/tm/weight');

router.get('/:start&:end', checkAuth, WeightController.get_by_date);

router.post('/', WeightController.add);

router.patch('/threshold', checkAuth, WeightController.update_threshold);
router.get('/threshold', checkAuth, WeightController.get_threshold);

module.exports = router;