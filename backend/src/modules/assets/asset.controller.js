// upto/backend/src/modules/assets/asset.controller.js
const assetService = require('./asset.service');

// تابع برای دریافت Asset ها
const getAllAssets = async (req, res) => {
  try {
    const assets = await assetService.findAll(req.query);
    res.status(200).json(assets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assets', error: error.message });
  }
};

// تابع برای دریافت Asset های یک رویداد مشخص
const getAssetsByEventSlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const assets = await assetService.findByEventSlug(slug, req.query);
        res.status(200).json(assets);
    } catch (error) {
        res.status(500).json({ message: `Error fetching assets for event ${req.params.slug}`, error: error.message });
    }
};


// تابع برای آپلود یک Asset جدید
const uploadAsset = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file was uploaded.' });
    }

    // req.user توسط middleware احراز هویت (authenticateToken) به درخواست اضافه می‌شود
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Authentication error: User not identified.' });
    }

    const assetData = {
      title: req.body.title || 'Untitled Asset',
      description: req.body.description || null,
      usage_type: req.body.usage_type || 'uncategorized',
      event_id: req.body.eventId || null, // eventId را از body می‌گیریم
      uploaded_by: req.user.id
    };

    const newAsset = await assetService.create(assetData, req.file);
    res.status(201).json(newAsset);

  } catch (error) {
    console.error('Asset Upload Controller Error:', error);
    res.status(500).json({ message: 'Internal server error during file upload', error: error.message });
  }
};

// تابع برای حذف یک Asset
const deleteAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAsset = await assetService.deleteById(id);
    if (!deletedAsset) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    res.status(200).json({ message: 'Asset deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting asset', error: error.message });
  }
};


// اکسپورت کردن تمام توابع در یک آبجکت واحد
module.exports = {
  getAllAssets,
  getAssetsByEventSlug,
  uploadAsset,
  deleteAsset,
};