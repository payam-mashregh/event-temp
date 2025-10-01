// upto/backend/src/modules/users/user.controller.js
const userService = require('./user.service');

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'خطا در دریافت کاربران', error: error.message });
    }
};

const createUser = async (req, res) => {
    try {
        if (!req.body.password) {
            return res.status(400).json({ message: 'رمز عبور الزامی است.' });
        }
        const newUser = await userService.create(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: 'خطا در ایجاد کاربر', error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = await userService.update(id, req.body);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: 'خطا در به‌روزرسانی کاربر', error: error.message });
    }
};

const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        if (typeof isActive !== 'boolean') {
            return res.status(400).json({ message: 'مقدار وضعیت (isActive) نامعتبر یا ارسال نشده است.' });
        }

        const updatedUser = await userService.setStatus(id, isActive);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: 'خطا در تغییر وضعیت کاربر', error: error.message });
    }
};

const assignEventToUser = async (req, res) => {
    try {
        const { userId, eventId } = req.body;
        if (!userId || !eventId) {
            return res.status(400).json({ message: 'شناسه کاربر و رویداد الزامی است.' });
        }
        await userService.assignEvent(userId, eventId);
        res.status(200).json({ message: 'رویداد با موفقیت به کاربر تخصیص داده شد.' });
    } catch (error) {
        if (error.code === '23505') {
             return res.status(409).json({ message: 'این رویداد قبلاً به این کاربر تخصیص داده شده است.' });
        }
        res.status(500).json({ message: 'خطا در تخصیص رویداد', error: error.message });
    }
};

const getManagedEventsForUser = async (req, res) => {
    try {
        const { id } = req.params;
        const events = await userService.getManagedEvents(id);
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'خطا در دریافت رویدادهای کاربر', error: error.message });
    }
};

const unassignEventFromUser = async (req, res) => {
    try {
        const { userId, eventId } = req.params;
        await userService.unassignEvent(userId, eventId);
        res.status(200).json({ message: 'تخصیص رویداد با موفقیت حذف شد.' });
    } catch (error) {
        res.status(500).json({ message: 'خطا در حذف تخصیص رویداد', error: error.message });
    }
};

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    updateUserStatus,
    assignEventToUser,
    getManagedEventsForUser,
    unassignEventFromUser,
};