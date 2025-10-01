// upto/backend/src/modules/contact/contact.service.js
const contactModel = require('./contact.model');
const eventModel = require('../events/event.model');

const service = {};

service.getAllByEventSlug = async (slug) => {
    const event = await eventModel.findBySlug(slug);
    if (!event) {
        throw new Error('رویداد یافت نشد.');
    }
    return await contactModel.findByEventId(event.id);
};

service.create = async (data) => {
    return await contactModel.create(data);
};

// ... (سایر توابع سرویس)

module.exports = service;