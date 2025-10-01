// upto/backend/src/modules/participants/participant.model.js
const db = require('../../config/db');

const ParticipantModel = {};

ParticipantModel.findByEventSlug = async (slug) => {
    const { rows } = await db.query(
        `SELECT p.id, p.name, p.email, p.mobile_number, r.registration_date
         FROM participants p
         JOIN registrations r ON p.id = r.participant_id
         JOIN events e ON r.event_id = e.id
         WHERE e.slug = $1
         ORDER BY r.registration_date DESC`,
        [slug]
    );
    return rows;
};

ParticipantModel.findAll = async () => {
    const { rows } = await db.query('SELECT * FROM participants ORDER BY id DESC');
    return rows;
};

ParticipantModel.findById = async (id) => {
    const { rows } = await db.query('SELECT * FROM participants WHERE id = $1', [id]);
    return rows[0];
};

ParticipantModel.findByEmail = async (email) => {
    const { rows } = await db.query('SELECT * FROM participants WHERE email = $1', [email]);
    return rows[0];
};

ParticipantModel.create = async (participantData) => {
    const { name, email, mobile_number } = participantData;
    const { rows } = await db.query(
        'INSERT INTO participants (name, email, mobile_number) VALUES ($1, $2, $3) RETURNING *',
        [name, email, mobile_number]
    );
    return rows[0];
};

ParticipantModel.update = async (id, participantData) => {
     const { name, email, mobile_number } = participantData;
     const { rows } = await db.query(
        'UPDATE participants SET name = $1, email = $2, mobile_number = $3 WHERE id = $4 RETURNING *',
        [name, email, mobile_number, id]
    );
    return rows[0];
};

ParticipantModel.remove = async (id) => {
    const result = await db.query('DELETE FROM participants WHERE id = $1', [id]);
    return result.rowCount > 0;
};

module.exports = ParticipantModel;