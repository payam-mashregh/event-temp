// upto/backend/src/modules/settings/settings.controller.js
const settingsService = require('./settings.service');

const settingsController = {};

settingsController.getAllSettings = async (req, res) => {
    try {
        const settings = await settingsService.getAll();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching settings', error: error.message });
    }
};

settingsController.updateSettings = async (req, res) => {
    try {
        // req.body should be an object like { setting_key: "new_value", another_key: "another_value" }
        await settingsService.update(req.body);
        res.status(200).json({ message: 'Settings updated successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error updating settings', error: error.message });
    }
};

module.exports = settingsController;