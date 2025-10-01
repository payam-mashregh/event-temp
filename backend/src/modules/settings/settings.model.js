// backend/src/modules/settings/settings.model.js
const pool = require('../../config/db');

const getSettings = async () => {
    const result = await pool.query('SELECT * FROM site_settings');
    // Convert array of objects to a single key-value object for easier use
    return result.rows.reduce((acc, row) => {
        acc[row.setting_key] = row.setting_value;
        return acc;
    }, {});
};

const updateSettings = async (settings) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        // Loop through each setting and update it in the database
        for (const [key, value] of Object.entries(settings)) {
            await client.query(
                `INSERT INTO site_settings (setting_key, setting_value)
                 VALUES ($1, $2)
                 ON CONFLICT (setting_key) 
                 DO UPDATE SET setting_value = $2`, // If key exists, update it; otherwise, insert it
                [key, value]
            );
        }
        await client.query('COMMIT'); // Commit the transaction
    } catch (e) {
        await client.query('ROLLBACK'); // Roll back in case of an error
        throw e;
    } finally {
        client.release(); // Release the client back to the pool
    }
};

module.exports = { getSettings, updateSettings };