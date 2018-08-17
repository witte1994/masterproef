const express = require('express');
const router = express.Router();

const BPController = require('../controller/bp');

router.get('/:start&:end', BPController.get_by_date);
router.get('/small/:start&:end', BPController.get_small_by_date);

router.post('/', BPController.add);

router.post('/threshold', BPController.set_threshold);
router.patch('/threshold', BPController.update_threshold);
router.get('/threshold', BPController.get_threshold);

module.exports = router;