// backend/src/modules/contact/contact.model.js
const pool = require('../../config/db'); // <-- مسیر اصلاح شد

const create = async ({ event_id, full_name, email, message }) => {
    const result = await pool.query(
        'INSERT INTO contact_messages (event_id, full_name, email, message) VALUES ($1, $2, $3, $4) RETURNING *',
        [event_id, full_name, email, message]
    );
    return result.rows[0];
};

const findByEventId = async (eventId) => {
    const result = await pool.query(
        'SELECT * FROM contact_messages WHERE event_id = $1 ORDER BY created_at DESC',
        [eventId]
    );
    return result.rows;
};

module.exports = {
    create,
    findByEventId,
};