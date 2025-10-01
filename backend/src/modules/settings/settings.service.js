// backend/src/modules/settings/settings.service.js
const Settings = require('./settings.model');

const getAllSettings = () => Settings.getSettings();
const saveAllSettings = (settingsData) => Settings.updateSettings(settingsData);

module.exports = { getAllSettings, saveAllSettings };