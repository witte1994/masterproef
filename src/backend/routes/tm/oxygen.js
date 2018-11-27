const express = require('express');
const router = express.Router();
const checkAuth = require('../../models/auth/check-auth');

const OxygenController = require('../../controller/tm/oxygen');

router.get('/:start&:end', checkAuth, OxygenController.get_by_date);

router.post('/', OxygenController.add);

router.patch('/threshold', checkAuth, OxygenController.update_threshold);
router.get('/threshold', checkAuth, OxygenController.get_threshold);

module.exports = router;