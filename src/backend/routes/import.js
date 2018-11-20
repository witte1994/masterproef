const express = require('express');
const router = express.Router();
//const checkAuth = require('../models/auth/check-auth');

const ImportController = require('../controller/import');
const MedicationController = require('../controller/modules/medication');

router.post('/', ImportController.import);
router.post('/medication', MedicationController.import);

module.exports = router;