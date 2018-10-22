const express = require('express');
const router = express.Router();
const checkAuth = require('../models/auth/check-auth');

const VaccinationController = require('../controller/vaccination');

router.get('/', checkAuth, VaccinationController.get_all_by_id);

router.post('/create', VaccinationController.create);
router.post('/update', VaccinationController.update);
router.delete('/delete/:id', VaccinationController.delete);

router.post('/:id/create', VaccinationController.create_entry);
router.post('/:id/update', VaccinationController.update_entry);
router.delete('/:id/delete/:entryId', VaccinationController.delete_entry);

module.exports = router;