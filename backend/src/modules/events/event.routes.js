// upto/backend/src/modules/events/event.routes.js
const express = require('express');
const router = express.Router();
const eventController = require('./event.controller');
const { authenticateToken } = require('../../middleware/auth');
const { isEventManager, isAdmin } = require('../../middleware/permission');
const upload = require('../../middleware/upload');

// --- مسیرهای ثابت باید قبل از مسیرهای داینامیک تعریف شوند ---

// مسیرهای عمومی ثابت
router.get('/', eventController.getAllEvents);
router.get('/upcoming', eventController.getUpcomingEvents);

// مسیرهای ثابت نیازمند احراز هویت
router.get('/my-events', authenticateToken, eventController.getMyEvents);
router.get('/titles', authenticateToken, eventController.getAllEventTitles);

// اکنون مسیرهای داینامیک را تعریف می‌کنیم
router.get('/:slug', eventController.getEventBySlug);
router.get('/:slug/pages', eventController.getPageContent);
router.get('/:slug/stats', authenticateToken, eventController.getStats);

// --- مسیرهای مدیریتی ---

// برای ایجاد رویداد، از middleware آپلود استفاده می‌کنیم
router.post('/', authenticateToken, isEventManager, upload.single('poster_file'), eventController.createEvent);

// برای به‌روزرسانی رویداد، از middleware آپلود استفاده می‌کنیم
router.put('/:id', authenticateToken, isEventManager, upload.single('poster_file'), eventController.updateEvent);

router.put('/:slug/pages', authenticateToken, isEventManager, eventController.updatePageContent);
router.delete('/:id', authenticateToken, isAdmin, eventController.deleteEvent);
router.get('/:eventId/managers', authenticateToken, isAdmin, eventController.getManagers);
router.post('/managers', authenticateToken, isAdmin, eventController.addManager);
router.delete('/managers', authenticateToken, isAdmin, eventController.removeManager);

module.exports = router;