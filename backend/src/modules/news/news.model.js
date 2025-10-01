// upto/backend/src/modules/news/news.model.js
const pool = require('../../config/db');
const model = {};

model.findAll = async () => {
  const result = await pool.query(
    `SELECT n.*, e.name as event_name, e.slug as event_slug 
     FROM news n
     LEFT JOIN events e ON n.event_id = e.id
     ORDER BY n.published_at DESC`
  );
  return result.rows;
};

model.findLatestNewsPerEvent = async (limit = 3) => {
  const result = await pool.query(
    `SELECT DISTINCT ON (n.event_id)
        n.id, n.title, n.content, n.published_at, n.image_url, n.tag,
        e.name as event_name, e.slug as event_slug
     FROM news n
     JOIN events e ON n.event_id = e.id
     WHERE n.is_general = false
     ORDER BY n.event_id, n.published_at DESC
     LIMIT $1`,
    [limit]
  );
  return result.rows;
};

model.findByEventId = async (eventId) => {
    const result = await pool.query(
        'SELECT * FROM news WHERE event_id = $1 ORDER BY published_at DESC',
        [eventId]
    );
    return result.rows;
};

model.findById = async (id) => {
    const result = await pool.query(
        `SELECT n.*, e.name as event_name, e.slug as event_slug 
         FROM news n
         LEFT JOIN events e ON n.event_id = e.id
         WHERE n.id = $1`, 
        [id]
    );
    return result.rows[0];
};

model.create = async ({ event_id, title, content, image_url, tag }) => {
    const result = await pool.query(
        'INSERT INTO news (event_id, title, content, image_url, is_general, tag) VALUES ($1, $2, $3, $4, false, $5) RETURNING *',
        [event_id, title, content, image_url, tag]
    );
    return result.rows[0];
};

model.update = async (id, { title, content, image_url, tag }) => {
    const result = await pool.query(
        'UPDATE news SET title = $1, content = $2, image_url = $3, tag = $4 WHERE id = $5 RETURNING *',
        [title, content, image_url, tag, id]
    );
    return result.rows[0];
};

model.remove = async (id) => {
    const result = await pool.query('DELETE FROM news WHERE id = $1', [id]);
    return result.rowCount > 0;
};

module.exports = model;