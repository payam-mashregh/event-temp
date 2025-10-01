// upto/backend/src/middleware/permission.js

/**
 * Middleware برای بررسی اینکه آیا کاربر نقش 'event_manager' یا 'admin' را دارد یا خیر.
 * این middleware به کاربر اجازه می‌دهد تا رویدادها را مدیریت کند.
 */
const isEventManager = (req, res, next) => {
    // req.user توسط middleware قبلی (authenticateToken) به درخواست اضافه شده است.
    if (req.user && (req.user.role === 'admin' || req.user.role === 'event_manager')) {
        // اگر کاربر نقش مورد نیاز را داشت، به مرحله بعد (کنترلر) برو.
        return next();
    }
    // در غیر این صورت، خطای عدم دسترسی را برگردان.
    return res.status(403).json({ message: 'عدم دسترسی: شما اجازه انجام این عملیات را ندارید.' });
};

/**
 * Middleware برای بررسی اینکه آیا کاربر نقش 'admin' را دارد یا خیر.
 * این middleware فقط به ادمین کل سیستم اجازه دسترسی می‌دهد.
 */
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        // اگر کاربر ادمین بود، به مرحله بعد برو.
        return next();
    }
    // در غیر این صورت، خطای عدم دسترسی را برگردان.
    return res.status(403).json({ message: 'عدم دسترسی: این عملیات فقط برای ادمین مجاز است.' });
};

// توابع را export می‌کنیم تا در فایل‌های دیگر (مانند user.routes.js) قابل استفاده باشند.
module.exports = {
    isEventManager,
    isAdmin,
};