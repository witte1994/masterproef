const express = require('express');
const router = express.Router();

const OxygenController = require('../controller/oxygen');

router.get('/:start&:end', OxygenController.get_by_date);
router.get('/small/:start&:end', OxygenController.get_small_by_date);

router.post('/', OxygenController.add);

router.post('/threshold', OxygenController.set_threshold);
router.patch('/threshold', OxygenController.update_threshold);
router.get('/threshold', OxygenController.get_threshold);

module.exports = router;