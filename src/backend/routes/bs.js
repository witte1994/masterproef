const express = require('express');
const router = express.Router();
const checkAuth = require('../models/auth/check-auth');

const BSController = require('../controller/bs');

router.get('/:start&:end', checkAuth, BSController.get_by_date);
router.get('/small/:start&:end', checkAuth, BSController.get_small_by_date);

router.post('/', BSController.add);

router.patch('/threshold', checkAuth, BSController.update_threshold);
router.get('/threshold', checkAuth, BSController.get_threshold);

module.exports = router;