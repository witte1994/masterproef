const express = require('express');
const router = express.Router();
const checkAuth = require('../models/auth/check-auth');

const OxygenController = require('../controller/oxygen');

router.get('/:start&:end', checkAuth, OxygenController.get_by_date);
router.get('/small/:start&:end', checkAuth, OxygenController.get_small_by_date);

router.post('/', OxygenController.add);

router.patch('/threshold', checkAuth, OxygenController.update_threshold);
router.get('/threshold', checkAuth, OxygenController.get_threshold);

module.exports = router;