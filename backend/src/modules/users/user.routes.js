// upto/backend/src/modules/users/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const { authenticateToken } = require('../../middleware/auth');
const { isAdmin } = require('../../middleware/permission');

const adminAccess = [authenticateToken, isAdmin];

router.get('/', adminAccess, userController.getAllUsers);
router.post('/', adminAccess, userController.createUser);
router.put('/:id', adminAccess, userController.updateUser);
router.put('/:id/status', adminAccess, userController.updateUserStatus);
router.post('/assign-event', adminAccess, userController.assignEventToUser);

// مسیر برای دریافت رویدادهای یک کاربر خاص
router.get('/:id/events', adminAccess, userController.getManagedEventsForUser);

// مسیر برای حذف تخصیص یک رویداد از یک کاربر
router.delete('/:userId/events/:eventId', adminAccess, userController.unassignEventFromUser);

module.exports = router;