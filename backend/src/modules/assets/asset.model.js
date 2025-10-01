// upto/backend/src/modules/assets/asset.model.js
const db = require('../../config/db');
const AssetModel = {};

AssetModel.findByEventSlug = async (slug) => { /* ... */ };
AssetModel.findAll = async () => { /* ... */ };

AssetModel.create = async (assetData, file) => {
    const { title, description, asset_type, file_size_kb, uploaded_by } = assetData;
    const file_url = `/uploads/${file.filename}`;
    
    // اطمینان از اینکه مقادیر null به درستی به پایگاه داده ارسال می‌شوند
    const { rows } = await db.query(
        'INSERT INTO assets (title, description, file_url, asset_type, file_size_kb, uploaded_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [title, description, file_url, asset_type, file_size_kb, uploaded_by]
    );
    return rows[0];
};

AssetModel.findById = async (id) => { /* ... */ };
AssetModel.remove = async (id) => { /* ... */ };

module.exports = AssetModel;