// upto/backend/src/modules/settings/settings.routes.js
const express = require('express');
const settingsController = require('./settings.controller');
const { authenticateToken, isAdmin } = require('../../middleware/auth');

const router = express.Router();

// Get all settings (Admin only)
router.get(
    '/',
    authenticateToken,
    isAdmin,
    settingsController.getAllSettings
);

// Update settings (Admin only)
// Note: Using PUT for a collection-level update is a common pattern.
router.put(
    '/',
    authenticateToken,
    isAdmin,
    settingsController.updateSettings
);

module.exports = router;