// backend/src/modules/events/event.service.js
const Event = require('./event.model');

const getAllEvents = () => Event.findAll();
const getUpcomingEvents = () => Event.findUpcoming();
const getManagedEvents = (userId) => Event.findByManagerId(userId);
const getEventById = (id) => Event.findById(id);

// --- START: MODIFICATION ---
const getEventBySlug = (slug) => Event.findBySlug(slug);
// --- END: MODIFICATION ---

const createNewEvent = async (eventData) => {
    if (!eventData.name || !eventData.slug) {
        throw new Error('نام و اسلاگ رویداد الزامی است.');
    }
    eventData.slug = eventData.slug.toLowerCase().replace(/\s+/g, '-');
    
    try {
        return await Event.create(eventData);
    } catch (err) {
        if (err.code === '23505') {
            throw new Error('این اسلاگ قبلاً استفاده شده است. لطفاً یک اسلاگ دیگر انتخاب کنید.');
        }
        throw err;
    }
};

const updateEventById = async (id, eventData) => {
    if (eventData.slug) {
        eventData.slug = eventData.slug.toLowerCase().replace(/\s+/g, '-');
    }

    try {
        const updatedEvent = await Event.update(id, eventData);
        if (!updatedEvent) {
            throw new Error('رویدادی با این شناسه یافت نشد');
        }
        return updatedEvent;
    } catch (err) {
        if (err.code === '23505') {
            throw new Error('این اسلاگ قبلاً توسط رویداد دیگری استفاده شده است.');
        }
        throw err;
    }
};

const deleteEventById = async (id) => {
    const wasDeleted = await Event.remove(id);
    if (!wasDeleted) {
        throw new Error('رویدادی با این شناسه یافت نشد');
    }
    return true;
};

const getEventDashboardStats = (eventId) => Event.getStatsById(eventId);

module.exports = {
    getAllEvents,
    getUpcomingEvents,
    getManagedEvents,
    getEventById,
    // --- START: MODIFICATION ---
    getEventBySlug,
    // --- END: MODIFICATION ---
    createNewEvent,
    updateEventById,
    deleteEventById,
    getEventDashboardStats
};