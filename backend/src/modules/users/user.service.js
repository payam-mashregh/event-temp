// upto/backend/src/modules/users/user.service.js
const userModel = require('./user.model');
const bcrypt = require('bcryptjs');

const getAll = async () => {
    return await userModel.findAll();
};

const getById = async (id) => {
    return await userModel.findById(id);
};

const create = async (userData) => {
    const { username, password, fullName, role } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    return await userModel.create({
        username,
        password_hash: hashedPassword,
        full_name: fullName,
        role: role || 'event_manager',
    });
};

const update = async (id, userData) => {
    const { fullName, role, password } = userData;
    const updateData = {};
    if (fullName) updateData.full_name = fullName;
    if (role) updateData.role = role;

    if (password && password.trim() !== '') {
        updateData.password_hash = await bcrypt.hash(password, 10);
    }
    return await userModel.update(id, updateData);
};

const setStatus = async (id, isActive) => {
    return await userModel.update(id, { is_active: isActive });
};

const getManagedEvents = async (userId) => {
    return await userModel.findManagedEvents(userId);
};

const assignEvent = async (userId, eventId) => {
    // این تابع اکنون به درستی تابع addManagedEvent را از مدل فراخوانی می‌کند
    return await userModel.addManagedEvent(userId, eventId);
};

const unassignEvent = async (userId, eventId) => {
    return await userModel.removeManagedEvent(userId, eventId);
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    setStatus,
    getManagedEvents,
    assignEvent,
    unassignEvent,
};