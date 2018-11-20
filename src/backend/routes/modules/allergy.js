const express = require('express');
const router = express.Router();
const checkAuth = require('../../models/auth/check-auth');

const AllergyController = require('../../controller/modules/allergy');

router.get('/', checkAuth, AllergyController.get_all_by_id);

router.post('/create', AllergyController.create);
router.post('/update', AllergyController.update);
router.delete('/delete/:id', AllergyController.delete);

module.exports = router;