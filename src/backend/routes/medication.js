const express = require('express');
const router = express.Router();
const checkAuth = require('../models/auth/check-auth');

const MedicationController = require('../controller/medication');

router.get('/', MedicationController.get_medication);

module.exports = router;