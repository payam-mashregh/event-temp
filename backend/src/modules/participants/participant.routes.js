// upto/backend/src/modules/participants/participant.routes.js
const express = require('express');
const participantController = require('./participant.controller');
const { authenticateToken } = require('../../middleware/auth');
const { isEventManager } = require('../../middleware/permission');

const router = express.Router();

// This route now correctly uses the event slug to fetch participants
router.get(
    '/event/:slug',
    authenticateToken,
    isEventManager,
    participantController.getParticipantsByEventSlug
);

// Add other routes for creating, updating participants if needed in the future

module.exports = router;