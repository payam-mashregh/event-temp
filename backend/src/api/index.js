// upto/backend/src/api/index.js
const express = require('express');
const router = express.Router();

// Import all modular routes
const authRoutes = require('../modules/auth/auth.routes');
const userRoutes = require('../modules/users/user.routes');
const eventRoutes = require('../modules/events/event.routes');
const newsRoutes = require('../modules/news/news.routes');
const sponsorRoutes = require('../modules/sponsors/sponsor.routes');
const timelineRoutes = require('../modules/timeline/timeline.routes');
const contactRoutes = require('../modules/contact/contact.routes');
const formRoutes = require('../modules/forms/form.routes');
const participantRoutes = require('../modules/participants/participant.routes');
const settingRoutes = require('../modules/settings/settings.routes');

// --- Refactored Asset Management ---
// The single, unified route for all asset (file) operations
const assetRoutes = require('../modules/assets/asset.routes');

// Register all routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/events', eventRoutes);
router.use('/news', newsRoutes);
router.use('/sponsors', sponsorRoutes);
router.use('/timeline', timelineRoutes);
router.use('/contact', contactRoutes);
router.use('/forms', formRoutes);
router.use('/participants', participantRoutes);
router.use('/settings', settingRoutes);

// Register the unified asset route
router.use('/assets', assetRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

module.exports = router;