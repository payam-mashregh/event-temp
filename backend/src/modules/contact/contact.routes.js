// upto/backend/src/modules/contact/contact.routes.js
const express = require('express');
const contactController = require('./contact.controller');
const { authenticateToken } = require('../../middleware/auth');
const { isEventManager } = require('../../middleware/permission');

const router = express.Router();

// Public route for anyone to send a message via a contact form
router.post(
    '/',
    contactController.createMessage
);

// Protected route for event managers to get all messages for a specific event, using slug
router.get(
    '/event/:slug',
    authenticateToken,
    isEventManager,
    contactController.getAllMessagesForEventSlug
);

// Protected route to mark a message as read
router.put(
    '/:id/read',
    authenticateToken,
    isEventManager,
    contactController.markMessageAsRead
);

// Protected route to delete a message
router.delete(
    '/:id',
    authenticateToken,
    isEventManager,
    contactController.deleteMessage
);

module.exports = router;