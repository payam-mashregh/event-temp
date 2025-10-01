// upto/backend/src/modules/sponsors/sponsor.routes.js
const express = require('express');
const router = express.Router();
const sponsorController = require('./sponsor.controller');
const { authenticateToken } = require('../../middleware/auth');
const { isEventManager } = require('../../middleware/permission');
const upload = require('../../middleware/upload');

// مسیر برای دریافت تمام حامیان مالی یک رویداد (با استفاده از eventSlug)
router.get('/', authenticateToken, sponsorController.getAllSponsors);

// مسیر برای ایجاد یک حامی مالی جدید
router.post('/', authenticateToken, isEventManager, upload.single('logo'), sponsorController.createSponsor);

// مسیر برای به‌روزرسانی یک حامی مالی
router.put('/:id', authenticateToken, isEventManager, upload.single('logo'), sponsorController.updateSponsor);

// مسیر برای حذف یک حامی مالی
router.delete('/:id', authenticateToken, isEventManager, sponsorController.deleteSponsor);

module.exports = router;