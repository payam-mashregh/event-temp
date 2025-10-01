// upto/backend/src/modules/sponsors/sponsor.service.js
const sponsorModel = require('./sponsor.model');
const fs = require('fs/promises');
const path = require('path');

const sponsorService = {};

sponsorService.getAllByEventSlug = async (slug) => {
    return await sponsorModel.findAllByEventSlug(slug);
};

sponsorService.create = async (sponsorData) => {
    const dataToSave = { ...sponsorData, event_id: sponsorData.eventId };
    delete dataToSave.eventId;
    return await sponsorModel.create(dataToSave);
};

sponsorService.update = async (id, sponsorData) => {
    return await sponsorModel.update(id, sponsorData);
};

sponsorService.delete = async (id) => {
    try {
        const sponsor = await sponsorModel.findById(id);
        if (sponsor && sponsor.logo_url) {
            const filePath = path.join(__dirname, `../../../public${sponsor.logo_url}`);
            await fs.unlink(filePath).catch(err => console.error(`فایل لوگو یافت نشد، از حذف صرف‌نظر شد: ${filePath}`));
        }
    } catch (error) {
        console.error(`خطا در حذف فایل لوگو برای حامی مالی ${id}:`, error);
    }
    return await sponsorModel.delete(id);
};

module.exports = sponsorService;