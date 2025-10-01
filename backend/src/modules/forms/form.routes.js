// upto/backend/src/modules/forms/form.routes.js
const express = require('express');
const formController = require('./form.controller');
const { authenticateToken } = require('../../middleware/auth');
const { isEventManager } = require('../../middleware/permission');

const router = express.Router();

// Get the form for a specific event
router.get(
    '/event/:eventId',
    formController.getFormByEventId
);

// Create or update the form for an event (Protected)
router.post(
    '/event/:eventId',
    authenticateToken,
    isEventManager,
    formController.createOrUpdateForm
);

// Get all submissions for a form (Protected)
router.get(
    '/:formId/submissions',
    authenticateToken,
    isEventManager,
    formController.getFormSubmissions
);

// Public route for users to submit the form
router.post(
    '/:formId/submit',
    formController.submitForm
);

module.exports = router;