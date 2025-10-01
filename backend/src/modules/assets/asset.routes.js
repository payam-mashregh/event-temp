// upto/backend/src/modules/assets/asset.routes.js
const express = require('express');
const router = express.Router();

// کنترلر را با توابع اکسپورت شده جدید وارد می‌کنیم
const assetController = require('./asset.controller');

// Middleware های مورد نیاز
const { authenticateToken } = require('../../middleware/auth');
const { isEventManager } = require('../../middleware/permission');
const upload = require('../../middleware/upload');

// مسیر اصلی برای آپلود یک فایل جدید
// POST /api/assets
// از authenticateToken برای احراز هویت و upload.single برای پردازش فایل استفاده می‌کند
router.post(
    '/',
    authenticateToken,
    upload.single('file'), // این middleware فایل را پردازش و در req.file قرار می‌دهد
    assetController.uploadAsset // اکنون این تابع قطعا تعریف شده است
);

// مسیر دریافت Asset های یک رویداد خاص بر اساس slug
// GET /api/assets/event/:slug
router.get(
    '/event/:slug',
    authenticateToken,
    assetController.getAssetsByEventSlug
);

// مسیر عمومی برای دریافت همه Asset ها (با قابلیت فیلتر)
// GET /api/assets
router.get(
    '/',
    authenticateToken,
    assetController.getAllAssets
);

// مسیر حذف یک Asset بر اساس ID
// DELETE /api/assets/:id
router.delete(
    '/:id',
    authenticateToken,
    isEventManager, // فقط مدیران رویداد می‌توانند حذف کنند
    assetController.deleteAsset
);

module.exports = router;