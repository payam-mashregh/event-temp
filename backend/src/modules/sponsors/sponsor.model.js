// upto/backend/src/modules/sponsors/sponsor.model.js
const pool = require('../../config/db');
const model = {};

model.findAllByEventSlug = async (slug) => {
    const query = `
        SELECT s.* FROM sponsors s
        JOIN events e ON s.event_id = e.id
        WHERE e.slug = $1
        ORDER BY s.created_at DESC
    `;
    const result = await pool.query(query, [slug]);
    return result.rows;
};

model.findById = async (id) => {
    const result = await pool.query('SELECT * FROM sponsors WHERE id = $1', [id]);
    return result.rows[0];
};

model.create = async (sponsorData) => {
    const { event_id, name, logo_url, website_url, sponsorship_level } = sponsorData;
    const query = `
        INSERT INTO sponsors (event_id, name, logo_url, website_url, sponsorship_level)
        VALUES ($1, $2, $3, $4, $5) RETURNING *
    `;
    const result = await pool.query(query, [event_id, name, logo_url, website_url, sponsorship_level]);
    return result.rows[0];
};

model.update = async (id, sponsorData) => {
    const { name, website_url, sponsorship_level, logo_url } = sponsorData;
    const query = `
        UPDATE sponsors SET
            name = COALESCE($1, name),
            website_url = COALESCE($2, website_url),
            sponsorship_level = COALESCE($3, sponsorship_level),
            logo_url = COALESCE($4, logo_url)
        WHERE id = $5 RETURNING *
    `;
    const result = await pool.query(query, [name, website_url, sponsorship_level, logo_url, id]);
    return result.rows[0];
};

model.delete = async (id) => {
    await pool.query('DELETE FROM sponsors WHERE id = $1', [id]);
};

module.exports = model;