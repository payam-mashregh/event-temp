// upto/backend/src/modules/events/event.model.js
const pool = require('../../config/db');

const model = {};

model.findAll = async () => {
    const result = await pool.query('SELECT * FROM events ORDER BY created_at DESC');
    return result.rows;
};

model.findActiveEvents = async () => {
    const result = await pool.query('SELECT * FROM events WHERE is_active = true AND end_date >= NOW() ORDER BY start_date ASC');
    return result.rows;
};

model.findEventsByManager = async (userId) => {
    const query = `
        SELECT e.* FROM events e
        JOIN event_managers em ON e.id = em.event_id
        WHERE em.user_id = $1
        ORDER BY e.created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
};

model.findBySlug = async (slug) => {
    const result = await pool.query('SELECT * FROM events WHERE slug = $1', [slug]);
    return result.rows[0];
};

model.create = async (eventData) => {
    const { name, slug, topic, description, about_content, contact_content, location, start_date, end_date, event_type, website_url, poster_url, user_id, is_active, image } = eventData;
    const query = `
        INSERT INTO events (name, slug, topic, description, about_content, contact_content, location, start_date, end_date, event_type, website_url, poster_url, user_id, is_active, image)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *;
    `;
    const values = [name, slug, topic, description, about_content, contact_content, location, start_date, end_date, event_type || 'internal', website_url, poster_url, user_id, is_active, image];
    const result = await pool.query(query, values);
    return result.rows[0];
};

model.update = async (id, eventData) => {
    const fields = [];
    const values = [];
    let i = 1;
    for (const key in eventData) {
        if (eventData[key] !== undefined) {
            fields.push(`${key} = $${i++}`);
            values.push(eventData[key]);
        }
    }
    const query = `UPDATE events SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${i} RETURNING *`;
    values.push(id);
    const result = await pool.query(query, values);
    return result.rows[0];
};

model.delete = async (id) => {
    await pool.query('DELETE FROM events WHERE id = $1', [id]);
};

model.findManagersByEvent = async (eventId) => {
    const query = `
        SELECT u.id, u.full_name, u.username FROM users u
        JOIN event_managers em ON u.id = em.user_id
        WHERE em.event_id = $1;
    `;
    const result = await pool.query(query, [eventId]);
    return result.rows;
};

model.addManagerToEvent = async (eventId, userId) => {
    const query = 'INSERT INTO event_managers (event_id, user_id) VALUES ($1, $2)';
    await pool.query(query, [eventId, userId]);
};

model.removeManagerFromEvent = async (eventId, userId) => {
    const query = 'DELETE FROM event_managers WHERE event_id = $1 AND user_id = $2';
    await pool.query(query, [eventId, userId]);
};

model.getEventStats = async (eventId) => {
    const registrations = await pool.query('SELECT COUNT(*) FROM registrations WHERE event_id = $1', [eventId]);
    const unreadMessages = await pool.query('SELECT COUNT(*) FROM contact_messages WHERE event_id = $1 AND is_read = false', [eventId]);
    return {
        registration_count: parseInt(registrations.rows[0].count, 10),
        unread_messages_count: parseInt(unreadMessages.rows[0].count, 10),
    };
};

model.findPageContentBySlug = async (eventSlug) => {
    const query = 'SELECT about_content, contact_content FROM events WHERE slug = $1';
    const result = await pool.query(query, [eventSlug]);
    return result.rows[0];
};

model.updatePageContent = async (eventId, content) => {
    const { about_content, contact_content } = content;
    const query = 'UPDATE events SET about_content = $1, contact_content = $2 WHERE id = $3 RETURNING about_content, contact_content';
    const result = await pool.query(query, [about_content, contact_content, eventId]);
    return result.rows[0];
};

model.findAllTitles = async () => {
    const result = await pool.query('SELECT id, name FROM events ORDER BY created_at DESC');
    return result.rows;
};

// --- START: تابع نهایی و کامل برای دریافت تمام جزئیات رویداد ---
model.findBySlugWithDetails = async (slug) => {
    const eventQuery = 'SELECT * FROM events WHERE slug = $1 AND is_active = true';
    const eventResult = await pool.query(eventQuery, [slug]);
    const event = eventResult.rows[0];

    if (!event) {
        return null;
    }

    const [newsRes, sponsorsRes, assetsRes, timelineRes, registrationFormRes] = await Promise.all([
        pool.query('SELECT * FROM news WHERE event_id = $1 ORDER BY published_at DESC', [event.id]),
        pool.query('SELECT * FROM sponsors WHERE event_id = $1 ORDER BY name ASC', [event.id]),
        pool.query('SELECT a.* FROM assets a JOIN event_assets ea ON a.id = ea.asset_id WHERE ea.event_id = $1', [event.id]),
        pool.query('SELECT * FROM timeline_items WHERE event_id = $1 ORDER BY start_date ASC', [event.id]),
        pool.query('SELECT * FROM registration_forms WHERE event_id = $1 LIMIT 1', [event.id])
    ]);

    const gallery = assetsRes.rows.filter(a => a.usage_type === 'gallery_image');
    const downloads = assetsRes.rows.filter(a => a.usage_type === 'downloadable_file');
    const multimedia = assetsRes.rows.filter(a => a.usage_type === 'media_item');

    return {
        ...event,
        news: newsRes.rows,
        sponsors: sponsorsRes.rows,
        gallery,
        downloads,
        multimedia,
        timeline: timelineRes.rows,
        registration_form: registrationFormRes.rows[0] || null,
    };
};
// --- END: تابع نهایی ---

module.exports = model;