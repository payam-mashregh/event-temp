// upto/backend/src/modules/sponsors/sponsor.controller.js
const sponsorService = require('./sponsor.service');

const sponsorController = {};

sponsorController.getAllSponsors = async (req, res) => {
    try {
        const { eventSlug } = req.query;
        if (!eventSlug) {
            return res.status(400).json({ message: 'پارامتر eventSlug الزامی است.' });
        }
        const sponsors = await sponsorService.getAllByEventSlug(eventSlug);
        res.status(200).json(sponsors);
    } catch (error) {
        res.status(500).json({ message: 'خطا در دریافت لیست حامیان مالی', error: error.message });
    }
};

sponsorController.createSponsor = async (req, res) => {
    try {
        const sponsorData = {
            ...req.body,
            logo_url: req.file ? `/uploads/${req.file.filename}` : null,
        };
        const newSponsor = await sponsorService.create(sponsorData);
        res.status(201).json(newSponsor);
    } catch (error) {
        res.status(500).json({ message: 'خطا در ایجاد حامی مالی', error: error.message });
    }
};

sponsorController.updateSponsor = async (req, res) => {
    try {
        const { id } = req.params;
        const sponsorData = { ...req.body };
        if (req.file) {
            sponsorData.logo_url = `/uploads/${req.file.filename}`;
        }
        const updatedSponsor = await sponsorService.update(id, sponsorData);
        res.status(200).json(updatedSponsor);
    } catch (error) {
        res.status(500).json({ message: 'خطا در به‌روزرسانی حامی مالی', error: error.message });
    }
};

sponsorController.deleteSponsor = async (req, res) => {
    try {
        const { id } = req.params;
        await sponsorService.delete(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'خطا در حذف حامی مالی', error: error.message });
    }
};

module.exports = sponsorController;