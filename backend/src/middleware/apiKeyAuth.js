const pool = require('../config/db');

const apiKeyAuth = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(401).json({ message: 'کلید API (X-API-KEY) در هدر درخواست وجود ندارد.' });
    }

    try {
        const result = await pool.query('SELECT id FROM events WHERE api_key = $1', [apiKey]);
        const event = result.rows[0];

        if (!event) {
            return res.status(403).json({ message: 'کلید API نامعتبر است.' });
        }

        // شناسه رویداد پیدا شده را به درخواست اضافه می‌کنیم تا در مرحله بعد استفاده شود
        req.eventId = event.id;
        next();

    } catch (error) {
        res.status(500).json({ message: 'خطای سرور در اعتبارسنجی کلید API.' });
    }
};

module.exports = { apiKeyAuth };