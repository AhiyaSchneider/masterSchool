/**
 * Defines all API routes for the admissions system.
 *
 * Routes:
 * - POST   /users                - Create a new user
 * - GET    /users/:userId/flow   - Get full admissions flow with user progress
 * - GET    /users/:userId/step   - Get the user's current step
 * - PUT    /steps/complete       - Mark a step as completed
 * - GET    /users/:userId/status - Get the user's current status
 */
const express = require('express');
const router = express.Router();
const admissionsController = require('../controllers/admissionsController');

router.post('/users', admissionsController.createUser);

router.get('/users/:userId/flow', admissionsController.getFlow);

router.get('/users/:userId/step', admissionsController.getCurrentStep);

router.put('/steps/complete', admissionsController.completeStep);

router.get('/users/:userId/status', admissionsController.getStatus);

module.exports = router;
