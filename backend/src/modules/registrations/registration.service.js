// upto/backend/src/modules/registrations/registration.service.js
const participantModel = require('../participants/participant.model');
const registrationModel = require('./registration.model');
const formModel = require('../forms/form.model');

const service = {};

service.registerParticipant = async (slug, submissionData) => {
    const { email, name, ...responses } = submissionData;
    
    // ۱. پیدا کردن رویداد و فرم ثبت نام
    const form = await formModel.findByEventSlug(slug);
    if (!form) {
        throw new Error('فرم ثبت نام برای این رویداد یافت نشد.');
    }
    const eventId = form.event_id;

    // ۲. پیدا کردن یا ایجاد شرکت‌کننده
    let participant = await participantModel.findByEmail(email);
    if (!participant) {
        participant = await participantModel.create({ name, email });
    }

    // ۳. ایجاد ثبت نام اصلی
    const registration = await registrationModel.create({
        event_id: eventId,
        participant_id: participant.id,
    });

    // ۴. ذخیره پاسخ‌های فرم
    const responsePromises = Object.entries(responses).map(([field_key, value]) => {
        return registrationModel.createResponse({
            registration_id: registration.id,
            field_key,
            value: JSON.stringify(value) // Store value as JSON
        });
    });

    await Promise.all(responsePromises);

    return { success: true, message: 'ثبت نام با موفقیت انجام شد.', registrationId: registration.id };
};

module.exports = service;