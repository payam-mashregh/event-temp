// upto/backend/src/modules/users/user.model.js
const pool = require('../../config/db');

const model = {};

model.findAll = async () => {
    // ما password_hash را از خروجی حذف می‌کنیم تا اطلاعات حساس به فرانت‌اند ارسال نشود
    const result = await pool.query('SELECT id, username, full_name, role, is_active, created_at FROM users ORDER BY created_at DESC');
    return result.rows;
};

model.findById = async (id) => {
    const result = await pool.query('SELECT id, username, full_name, role, is_active FROM users WHERE id = $1', [id]);
    return result.rows[0];
};

model.findByUsername = async (username) => {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
};

model.create = async (userData) => {
    const { username, password_hash, full_name, role } = userData;
    const query = `
        INSERT INTO users (username, password_hash, full_name, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, username, full_name, role, is_active;
    `;
    const result = await pool.query(query, [username, password_hash, full_name, role]);
    return result.rows[0];
};

model.update = async (id, userData) => {
    const fields = [];
    const values = [];
    let query = 'UPDATE users SET ';
    let i = 1;

    for (const key in userData) {
        if (userData[key] !== undefined) {
            fields.push(`${key} = $${i++}`);
            values.push(userData[key]);
        }
    }

    query += fields.join(', ');
    query += ` WHERE id = $${i} RETURNING id, username, full_name, role, is_active;`;
    values.push(id);

    const result = await pool.query(query, values);
    return result.rows[0];
};

model.findManagedEvents = async (userId) => {
    const query = `
        SELECT e.id, e.name 
        FROM events e
        JOIN event_managers em ON e.id = em.event_id
        WHERE em.user_id = $1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
};

model.addManagedEvent = async (userId, eventId) => {
    const query = 'INSERT INTO event_managers (user_id, event_id) VALUES ($1, $2) RETURNING *';
    const result = await pool.query(query, [userId, eventId]);
    return result.rows[0];
};

model.removeManagedEvent = async (userId, eventId) => {
    const query = 'DELETE FROM event_managers WHERE user_id = $1 AND event_id = $2';
    await pool.query(query, [userId, eventId]);
};

module.exports = model;