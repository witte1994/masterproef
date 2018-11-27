const express = require('express');
const router = express.Router();
const checkAuth = require('../../models/auth/check-auth');

const BPController = require('../../controller/tm/bp');

router.get('/:start&:end', checkAuth, BPController.get_by_date);

router.post('/', BPController.add);

router.patch('/threshold', checkAuth, BPController.update_threshold);
router.get('/threshold', checkAuth, BPController.get_threshold);

module.exports = router;