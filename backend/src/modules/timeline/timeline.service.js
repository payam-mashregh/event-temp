// upto/backend/src/modules/timeline/timeline.service.js
const timelineModel = require('./timeline.model');
const eventModel = require('../events/event.model');

const service = {};

service.create = async (slug, itemData) => {
    const event = await eventModel.findBySlug(slug);
    if (!event) {
        throw new Error('رویداد برای افزودن آیتم یافت نشد.');
    }
    // event_id را به داده‌ها اضافه می‌کنیم
    return await timelineModel.create({ ...itemData, event_id: event.id });
};

service.getAllByEventSlug = async (slug) => {
    const event = await eventModel.findBySlug(slug);
    if (!event) {
        throw new Error('رویداد یافت نشد.');
    }
    return await timelineModel.findByEventId(event.id);
};

service.getUpcoming = async (limit = 5) => {
    return await timelineModel.findUpcoming(limit);
};

service.update = async (id, itemData) => {
    return await timelineModel.update(id, itemData);
};

service.remove = async (id) => {
    return await timelineModel.remove(id);
};

module.exports = service;