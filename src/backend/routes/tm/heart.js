const express = require('express');
const router = express.Router();
const checkAuth = require('../../models/auth/check-auth');

const HeartController = require('../../controller/tm/heart');

router.get('/:start&:end', checkAuth, HeartController.get_by_date);

router.post('/', HeartController.add);

router.patch('/threshold', checkAuth, HeartController.update_threshold);
router.get('/threshold', checkAuth, HeartController.get_threshold);

module.exports = router;