// upto/backend/src/modules/news/news.routes.js
const express = require('express');
const newsController = require('./news.controller');
const { authenticateToken } = require('../../middleware/auth');
const { isEventManager } = require('../../middleware/permission');
const upload = require('../../middleware/upload');

const router = express.Router();

// Route for homepage
router.get('/latest-per-event', newsController.getLatestNewsPerEvent);

// Route for event-specific news page (now uses slug)
router.get('/event/:slug', newsController.getNewsByEventSlug);

// General routes
router.get('/', newsController.getAllNews);
router.get('/:id', newsController.getNewsById);

// Protected routes
router.post('/', authenticateToken, isEventManager, upload.single('image'), newsController.createNews);
router.put('/:id', authenticateToken, isEventManager, upload.single('image'), newsController.updateNews);
router.delete('/:id', authenticateToken, isEventManager, newsController.deleteNews);

module.exports = router;