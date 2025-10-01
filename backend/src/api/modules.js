// backend/src/api/modules.js
const express = require('express');
const authRoutes = require('../modules/auth/auth.routes');
const eventRoutes = require('../modules/events/event.routes');
const newsRoutes = require('../modules/news/news.routes');
const timelineRoutes = require('../modules/timeline/timeline.routes');
const userRoutes = require('../modules/users/user.routes');
const sponsorRoutes = require('../modules/sponsors/sponsor.routes');
const participantRoutes = require('../modules/participants/participant.routes');
const contactRoutes = require('../modules/contact/contact.routes');
const assetRoutes = require('../modules/assets/asset.routes');
const formRoutes = require('../modules/forms/form.routes');
const registrationRoutes = require('../modules/registrations/registration.routes');
const settingsRoutes = require('../modules/settings/settings.routes'); // --- ADD THIS LINE ---

const router = express.Router();

// All module routes are aggregated here
router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/news', newsRoutes);
router.use('/timeline', timelineRoutes);
router.use('/users', userRoutes);
router.use('/sponsors', sponsorRoutes);
router.use('/participants', participantRoutes);
router.use('/contact', contactRoutes);
router.use('/assets', assetRoutes);
router.use('/forms', formRoutes);
router.use('/registrations', registrationRoutes);
router.use('/settings', settingsRoutes); // --- ADD THIS LINE ---

module.exports = router;