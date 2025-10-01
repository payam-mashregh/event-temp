// backend/src/modules/registrations/registration.model.js
const pool = require('../../config/db');

/**
 * یک رکورد ثبت‌نام جدید برای یک شرکت‌کننده در یک رویداد ایجاد می‌کند
 */
const createRegistration = async (eventId, participantId) => {
    const result = await pool.query(
        'INSERT INTO registrations (event_id, participant_id, status) VALUES ($1, $2, $3) RETURNING *',
        [eventId, participantId, 'completed']
    );
    return result.rows[0];
};

/**
 * پاسخ‌های فرم داخلی مربوط به یک ثبت‌نام را ذخیره می‌کند
 */
const saveResponse = async (registrationId, fieldId, response) => {
    await pool.query(
        'INSERT INTO registration_responses (registration_id, field_id, response) VALUES ($1, $2, $3)',
        [registrationId, fieldId, response]
    );
};

/**
 * پاسخ‌های خام (JSON) از فرم خارجی را برای یک ثبت‌نام ذخیره می‌کند
 */
const saveRawResponses = async (registrationId, responses) => {
    await pool.query(
        'UPDATE registrations SET raw_responses = $1 WHERE id = $2',
        [responses]
    );
};


/**
 * تمام ثبت‌نام‌های یک رویداد را به همراه اطلاعات شرکت‌کننده و پاسخ‌های فرم برمی‌گرداند
 */
const findByEventId = async (eventId) => {
    const query = `
        SELECT
            r.id as registration_id,
            r.status,
            r.registration_date,
            r.raw_responses,
            p.id as participant_id,
            p.full_name,
            p.email,
            (SELECT json_agg(json_build_object('label', ff.label, 'response', rr.response))
             FROM registration_responses rr
             JOIN form_fields ff ON rr.field_id = ff.id
             WHERE rr.registration_id = r.id
            ) as responses
        FROM registrations r
        JOIN participants p ON r.participant_id = p.id
        WHERE r.event_id = $1
        ORDER BY r.registration_date DESC
    `;
    const result = await pool.query(query, [eventId]);
    return result.rows;
};

/**
 * تمام ثبت‌نام‌های یک شرکت‌کننده را برای پنل کاربری برمی‌گرداند
 */
const findByParticipantId = async (participantId) => {
    const query = `
        SELECT
            r.registration_date,
            r.status,
            e.name as event_name,
            e.slug as event_slug,
            e.start_date as event_start_date,
            e.location as event_location
        FROM registrations r
        JOIN events e ON r.event_id = e.id
        WHERE r.participant_id = $1
        ORDER BY e.start_date DESC
    `;
    const result = await pool.query(query, [participantId]);
    return result.rows;
};


module.exports = {
    createRegistration,
    saveResponse,
    saveRawResponses,
    findByEventId,
    findByParticipantId
};