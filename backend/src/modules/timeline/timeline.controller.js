// upto/backend/src/modules/timeline/timeline.controller.js
const timelineService = require('./timeline.service');

const controller = {};

controller.createTimelineItem = async (req, res) => {
    try {
        const { slug } = req.params;
        const newItem = await timelineService.create(slug, req.body);
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ message: 'خطا در ایجاد آیتم جدید', error: error.message });
    }
};

controller.getAllTimelineItemsForEvent = async (req, res) => {
    try {
        const { slug } = req.params;
        const items = await timelineService.getAllByEventSlug(slug);
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'خطا در واکشی آیتم‌های زمان‌بندی', error: error.message });
    }
};

controller.getUpcomingTimeline = async (req, res) => {
    try {
        const items = await timelineService.getUpcoming();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'خطا در واکشی فراخوان‌های آینده', error: error.message });
    }
};

controller.updateTimelineItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const updatedItem = await timelineService.update(itemId, req.body);
        if (!updatedItem) return res.status(404).json({ message: 'آیتم یافت نشد' });
        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: 'خطا در ویرایش آیتم', error: error.message });
    }
};

controller.deleteTimelineItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const result = await timelineService.remove(itemId);
        if (!result) return res.status(404).json({ message: 'آیتم یافت نشد' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'خطا در حذف آیتم', error: error.message });
    }
};

module.exports = controller;