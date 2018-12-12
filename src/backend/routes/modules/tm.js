const express = require('express');
const router = express.Router();
const checkAuth = require('../../models/auth/check-auth');

const TMController = require ('../../controller/modules/tm');

router.post('/', TMController.get_data);
router.post('/small', TMController.get_data_small);
router.get('/available', TMController.get_available_params);

module.exports = router;