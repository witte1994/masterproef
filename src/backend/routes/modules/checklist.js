const express = require('express');
const router = express.Router();
const checkAuth = require('../../models/auth/check-auth');

const ChecklistController = require('../../controller/modules/checklist');

router.get('/', checkAuth, ChecklistController.get_by_id);

router.post('/update', ChecklistController.update);

router.post('/:id/create', ChecklistController.create_step);
router.post('/:id/check', ChecklistController.check_step);
router.post('/:id/update', ChecklistController.update_step);
router.delete('/:id/delete/:stepId', ChecklistController.delete_step);

router.post('/:id/step/:stepId/create', ChecklistController.create_substep);
router.post('/:id/step/:substepId/check', ChecklistController.check_substep);
router.post('/:id/step/:substepId/update', ChecklistController.update_substep);
router.delete('/:id/step/:stepId/delete/:substepId', ChecklistController.delete_substep);

module.exports = router;