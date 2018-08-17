const express = require('express');
const router = express.Router();

const ClinicianController = require('../controller/clinician');

router.options('/', (req, res, next) => {
    return res.status(200).json({
        message: "ok"
    });
});

router.post('/signup', ClinicianController.signup);
router.post('/login', ClinicianController.login);

module.exports = router;