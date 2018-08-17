const express = require('express');
const router = express.Router();

const HeartController = require('../controller/heart');

router.get('/:start&:end', HeartController.get_by_date);
router.get('/small/:start&:end', HeartController.get_small_by_date);

router.post('/', HeartController.add);

router.post('/threshold', HeartController.set_threshold);
router.patch('/threshold', HeartController.update_threshold);
router.get('/threshold', HeartController.get_threshold);

module.exports = router;