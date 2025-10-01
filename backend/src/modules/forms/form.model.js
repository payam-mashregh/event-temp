// backend/src/modules/forms/form.model.js
const pool = require('../../config/db');

/**
 * یک فرم را بر اساس شناسه رویداد پیدا می‌کند
 */
const findFormByEventId = async (eventId) => {
    const result = await pool.query(
        `SELECT * FROM registration_forms WHERE event_id = $1`,
        [eventId]
    );
    // همیشه یک فرم برای هر رویداد وجود دارد یا null
    return result.rows[0];
};

/**
 * یک فرم جدید با ساختار JSON برای یک رویداد ایجاد می‌کند
 */
const createFormWithDefinition = async (eventId, formDefinition) => {
    const result = await pool.query(
        'INSERT INTO registration_forms (event_id, title, form_type, json_definition) VALUES ($1, $2, $3, $4) RETURNING *',
        [eventId, 'فرم ثبت‌نام داخلی', 'internal', formDefinition]
    );
    return result.rows[0];
};

/**
 * ساختار JSON یک فرم موجود را به‌روزرسانی می‌کند
 */
const updateFormDefinition = async (formId, formDefinition) => {
    const result = await pool.query(
        'UPDATE registration_forms SET json_definition = $1 WHERE id = $2 RETURNING *',
        [formDefinition, formId]
    );
    return result.rows[0];
};


module.exports = {
    findFormByEventId,
    createFormWithDefinition,
    updateFormDefinition,
};