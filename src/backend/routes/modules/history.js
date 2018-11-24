const express = require('express');
const router = express.Router();
const checkAuth = require('../../models/auth/check-auth');

const HistoryController = require('../../controller/modules/history');

router.get('/', checkAuth, HistoryController.get_by_id);
router.get('/:start&:end', checkAuth, HistoryController.get_by_date);

module.exports = router;