const express = require('express');
const router = express.Router();
const checkAuth = require('../../models/auth/check-auth');

const WorkflowController = require('../../controller/modules/workflow');

router.post('/', checkAuth, WorkflowController.get_all);

router.post('/create', WorkflowController.create);
router.post('/update', WorkflowController.update);
router.delete('/delete/:id', WorkflowController.delete);

router.post('/:id/create', WorkflowController.create_step);
router.post('/:id/update', WorkflowController.update_step);
router.delete('/:id/delete/:stepId', WorkflowController.delete_step);

module.exports = router;