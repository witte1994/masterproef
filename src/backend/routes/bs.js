const express = require('express');
const router = express.Router();

const BSController = require('../controller/bs');

router.get('/:start&:end', BSController.get_by_date);
router.get('/small/:start&:end', BSController.get_small_by_date);

router.post('/', BSController.add);

router.post('/threshold', BSController.set_threshold);
router.patch('/threshold', BSController.update_threshold);
router.get('/threshold', BSController.get_threshold);

module.exports = router;