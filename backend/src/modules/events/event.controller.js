// upto/backend/src/modules/events/event.controller.js
const eventModel = require('./event.model');
const slugify = require('slugify');

const controller = {};

controller.getAllEvents = async (req, res) => {
  try {
    const events = await eventModel.findAll();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
};

controller.getUpcomingEvents = async (req, res) => {
  try {
    const events = await eventModel.findActiveEvents();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching upcoming events', error: error.message });
  }
};

controller.getMyEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const events = await eventModel.findEventsByManager(userId);
    res.json(events);
  } catch (error) {
    console.error("Error fetching user's events:", error);
    res.status(500).json({ message: 'خطا در واکشی رویدادهای کاربر', error: error.message });
  }
};

controller.getEventBySlug = async (req, res) => {
  try {
    const event = await eventModel.findBySlugWithDetails(req.params.slug);
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: 'رویداد یافت نشد' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event', error: error.message });
  }
};

controller.createEvent = async (req, res) => {
  try {
    const { name } = req.body;
    const slug = slugify(name, { lower: true, strict: true });
    const eventData = { ...req.body, slug, user_id: req.user.id };

    // اگر فایلی آپلود شده بود، مسیر آن را به داده‌ها اضافه کن
    if (req.file) {
      eventData.poster_url = `/uploads/${req.file.filename}`;
    }

    const newEvent = await eventModel.create(eventData);
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
};

controller.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const eventData = { ...req.body };

    // اگر فایل جدیدی برای پوستر آپلود شده بود، مسیر آن را به‌روزرسانی کن
    if (req.file) {
      eventData.poster_url = `/uploads/${req.file.filename}`;
      // نکته: در یک سیستم واقعی، باید فایل قدیمی را از سرور حذف کنید
    }

    const updatedEvent = await eventModel.update(id, eventData);
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Error updating event', error: error.message });
  }
};

controller.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    await eventModel.delete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
};

controller.getManagers = async (req, res) => {
  try {
    const { eventId } = req.params;
    const managers = await eventModel.findManagersByEvent(eventId);
    res.json(managers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching managers', error: error.message });
  }
};

controller.addManager = async (req, res) => {
  try {
    const { eventId, userId } = req.body;
    await eventModel.addManagerToEvent(eventId, userId);
    res.status(200).json({ message: 'Manager added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding manager', error: error.message });
  }
};

controller.removeManager = async (req, res) => {
  try {
    const { eventId, userId } = req.body;
    await eventModel.removeManagerFromEvent(eventId, userId);
    res.status(200).json({ message: 'Manager removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing manager', error: error.message });
  }
};

controller.getStats = async (req, res) => {
  try {
    const slug = req.params.slug;
    const event = await eventModel.findBySlug(slug);
    if (!event) {
      return res.status(404).json({ message: 'رویداد یافت نشد' });
    }
    const stats = await eventModel.getEventStats(event.id);
    res.json(stats);
  } catch (error) {
    console.error('[Stats] Controller CRITICAL ERROR:', error);
    res.status(500).json({ message: 'خطا در واکشی آمار' });
  }
};

controller.getPageContent = async (req, res) => {
  try {
    const content = await eventModel.findPageContentBySlug(req.params.slug);
    if (!content) {
      return res.status(404).json({ message: 'محتوای صفحه برای این رویداد یافت نشد' });
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'خطا در واکشی محتوای صفحه', error: error.message });
  }
};

controller.updatePageContent = async (req, res) => {
  try {
    const { slug } = req.params;
    const event = await eventModel.findBySlug(slug);
    if (!event) {
      return res.status(404).json({ message: 'رویداد یافت نشد' });
    }
    const content = await eventModel.updatePageContent(event.id, req.body);
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'خطا در به‌روزرسانی محتوای صفحه', error: error.message });
  }
};

controller.getAllEventTitles = async (req, res) => {
    try {
        const events = await eventModel.findAllTitles();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'خطا در دریافت لیست رویدادها', error: error.message });
    }
};

module.exports = controller;