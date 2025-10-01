// upto/backend/src/modules/timeline/timeline.routes.js
const express = require('express');
const timelineController = require('./timeline.controller');
const { authenticateToken } = require('../../middleware/auth');
const { isEventManager } = require('../../middleware/permission');

const router = express.Router();

router.get('/upcoming', timelineController.getUpcomingTimeline);
router.get('/event/:slug', timelineController.getAllTimelineItemsForEvent);
router.post('/event/:slug', authenticateToken, isEventManager, timelineController.createTimelineItem);
router.put('/:itemId', authenticateToken, isEventManager, timelineController.updateTimelineItem);
router.delete('/:itemId', authenticateToken, isEventManager, timelineController.deleteTimelineItem);

module.exports = router;