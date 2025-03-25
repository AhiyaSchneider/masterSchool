const express = require('express');
const router = express.Router();
const admissionsController = require('../controllers/admissionsController');

// 1. Create a user
router.post('/users', admissionsController.createUser);

// 2. Get the full flow
router.get('/flow', admissionsController.getFlow);

// 3. Get current step for a user
router.get('/users/:userId/step', admissionsController.getCurrentStep);

// 4. Mark a step as completed
router.put('/steps/complete', admissionsController.completeStep);

// 5. Get status (accepted, rejected, in_progress)
router.get('/users/:userId/status', admissionsController.getStatus);

module.exports = router;
