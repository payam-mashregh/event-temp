// upto/backend/src/modules/auth/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');

// مسیر جدید برای دریافت تصویر کپچا
// GET /api/auth/captcha
router.get('/captcha', authController.generateCaptcha);

// مسیر برای ورود کاربر
// POST /api/auth/login
router.post('/login', authController.login);

// مسیر برای ثبت‌نام کاربر جدید
// POST /api/auth/register
router.post('/register', authController.register);

module.exports = router;