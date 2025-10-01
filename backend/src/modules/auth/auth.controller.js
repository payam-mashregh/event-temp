// upto/backend/src/modules/auth/auth.controller.js
const authService = require('./auth.service');
const svgCaptcha = require('svg-captcha');

const register = async (req, res) => {
    try {
        const { username, password, fullName } = req.body;
        const newUser = await authService.register({ username, password, fullName });
        res.status(201).json({ message: "کاربر با موفقیت ایجاد شد", user: newUser });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { username, password, captcha } = req.body;

        // --- START: Captcha Validation ---
        // بررسی می‌کند که کپچای ارسال شده با کپچای ذخیره شده در نشست کاربر یکسان باشد
        if (!captcha || !req.session.captcha || req.session.captcha.toLowerCase() !== captcha.toLowerCase()) {
            req.session.captcha = null; // ابطال کپچا پس از یک تلاش ناموفق
            return res.status(400).json({ message: 'متن کپچا صحیح نیست.' });
        }
        // پس از اعتبارسنجی موفق، کپچا را منقضی می‌کنیم تا یکبار مصرف باشد
        req.session.captcha = null;
        // --- END: Captcha Validation ---
        
        const { user, token } = await authService.login(username, password);

        // ارسال توکن و اطلاعات کاربر در پاسخ
        res.json({ message: "ورود موفقیت‌آمیز بود", user, token });

    } catch (error) {
        // ارسال خطای مشخص در صورت اشتباه بودن نام کاربری یا رمز عبور
        res.status(401).json({ message: error.message });
    }
};

const generateCaptcha = (req, res) => {
    // ایجاد یک تصویر کپچا با تنظیمات دلخواه
    const captcha = svgCaptcha.create({
        size: 6,             // تعداد کاراکترها
        ignoreChars: '0o1i', // حذف کاراکترهای مشابه
        noise: 2,            // میزان نویز در تصویر
        color: true,         // رنگی بودن
        background: '#f8f9fa' // رنگ پس‌زمینه
    });

    // متن صحیح کپچا را به صورت امن در نشست (session) کاربر ذخیره می‌کنیم
    req.session.captcha = captcha.text;

    // تصویر SVG را به عنوان پاسخ ارسال می‌کنیم
    res.type('svg');
    res.status(200).send(captcha.data);
};

module.exports = {
    register,
    login,
    generateCaptcha
};