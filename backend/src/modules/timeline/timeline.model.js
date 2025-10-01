// backend/src/modules/timeline/timeline.model.js
const pool = require('../../config/db');

const create = async ({ event_id, title, description, start_date, end_date, type = 'call' }) => {
    const result = await pool.query(
        'INSERT INTO timeline_items (event_id, title, description, start_date, end_date, type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [event_id, title, description, start_date || null, end_date || null, type]
    );
    return result.rows[0];
};

const findById = async (id) => {
    const result = await pool.query(
        `SELECT 
            ti.*,
            e.name as event_name,
            e.slug as event_slug
         FROM timeline_items ti
         JOIN events e ON ti.event_id = e.id
         WHERE ti.id = $1`,
        [id]
    );
    return result.rows[0];
};

const findByEventId = async (eventId) => {
    const result = await pool.query(
        'SELECT * FROM timeline_items WHERE event_id = $1 ORDER BY start_date ASC, end_date ASC',
        [eventId]
    );
    return result.rows;
};

const findUpcoming = async (limit = 5) => {
    const result = await pool.query(
        `SELECT 
            ti.id, ti.title, ti.end_date as deadline,
            e.name as event_name,
            e.slug as event_slug
         FROM timeline_items ti
         JOIN events e ON ti.event_id = e.id
         WHERE 
            ti.start_date::date <= NOW()::date AND ti.end_date::date >= NOW()::date
            AND ti.type = 'call'
         ORDER BY ti.end_date ASC
         LIMIT $1`,
        [limit]
    );
    return result.rows;
};

const findActive = async () => {
    const result = await pool.query(
        `SELECT ti.*, e.name as event_name, e.slug as event_slug
         FROM timeline_items ti
         JOIN events e ON ti.event_id = e.id
         WHERE 
            ti.start_date::date <= NOW()::date AND ti.end_date::date >= NOW()::date
            AND ti.type = 'call'
         ORDER BY ti.end_date ASC`
    );
    return result.rows;
};

const findArchived = async () => {
    const result = await pool.query(
        `SELECT ti.*, e.name as event_name, e.slug as event_slug
         FROM timeline_items ti
         JOIN events e ON ti.event_id = e.id
         WHERE 
            ti.end_date::date < NOW()::date
            AND ti.type = 'call'
         ORDER BY ti.end_date DESC`
    );
    return result.rows;
};

const update = async (id, { title, description, start_date, end_date }) => {
    const result = await pool.query(
        'UPDATE timeline_items SET title = $1, description = $2, start_date = $3, end_date = $4 WHERE id = $5 RETURNING *',
        [title, description, start_date || null, end_date || null, id]
    );
    return result.rows[0];
};

const remove = async (id) => {
    const result = await pool.query('DELETE FROM timeline_items WHERE id = $1', [id]);
    return result.rowCount > 0;
};

module.exports = {
  create,
  findById,
  findByEventId,
  findUpcoming,
  findActive,
  findArchived,
  update,
  remove,
};