const express = require('express');
const router = express.Router();
const checkAuth = require('../../models/auth/check-auth');

const PrescriptionController = require('../../controller/modules/prescription');

router.get('/', checkAuth, PrescriptionController.get_all_by_id);
router.get('/:start&:end', checkAuth, PrescriptionController.get_all_by_date);

router.post('/create', PrescriptionController.create);
router.post('/update', PrescriptionController.update);
router.delete('/delete/:id', PrescriptionController.delete);

module.exports = router;