const express = require('express');
const router = express.Router();
const checkAuth = require('../../models/auth/check-auth');

const MedicationController = require('../../controller/modules/medication');

router.get('/', MedicationController.get_medication);

module.exports = router;