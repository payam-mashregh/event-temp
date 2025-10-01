// upto/backend/src/modules/assets/asset.service.js

const pool = require('../../config/db');
const sharp = require('sharp'); // کتابخانه قدرتمند برای پردازش تصویر در سرور
const fs = require('fs/promises'); // ماژول کار با فایل سیستم به صورت Asynchronous
const path = require('path');

/**
 * ایجاد یک asset جدید، بهینه‌سازی تصویر (در صورت نیاز) و ذخیره در دیتابیس
 * @param {object} assetData - اطلاعات متا asset (title, description, etc.)
 * @param {object} file - فایل آپلود شده توسط multer
 * @returns {Promise<object>} - آبجکت asset جدید ایجاد شده
 */
const create = async (assetData, file) => {
    const { title, description, usage_type, event_id, uploaded_by } = assetData;
    
    // متغیرهایی برای نگهداری مسیر و نام فایل نهایی (ممکن است بهینه شود)
    let finalFilePath = file.path;
    let finalFilename = file.filename;
    let fileSizeKb = Math.round(file.size / 1024);
    
    // --- شروع منطق بهینه‌سازی در سمت سرور ---
    // فقط فایل‌هایی که از نوع تصویر هستند را پردازش می‌کنیم
    if (file.mimetype.startsWith('image/')) {
        const optimizedFilename = `optimized-${Date.now()}-${file.originalname.split('.')[0]}.webp`;
        const optimizedFilePath = path.join(file.destination, optimizedFilename);

        try {
            // استفاده از sharp برای پردازش تصویر
            await sharp(file.path)
                .resize({ width: 1920, height: 1080, fit: 'inside', withoutEnlargement: true }) // تغییر سایز هوشمند
                .toFormat('webp', { quality: 80 }) // تبدیل به فرمت مدرن و بهینه WebP
                .toFile(optimizedFilePath);

            // پس از موفقیت، فایل اصلی و غیربهینه را حذف می‌کنیم
            await fs.unlink(file.path); 
            
            // متغیرها را با اطلاعات فایل بهینه شده به‌روزرسانی می‌کنیم
            finalFilePath = optimizedFilePath;
            finalFilename = optimizedFilename;
            const stats = await fs.stat(optimizedFilePath);
            fileSizeKb = Math.round(stats.size / 1024);

        } catch (error) {
            console.error("Server-side optimization failed:", error);
            // در صورت شکست در بهینه‌سازی، از فایل اصلی استفاده می‌شود تا فرآیند متوقف نشود
        }
    }
    // --- پایان منطق بهینه‌سازی ---

    const client = await pool.connect();
    try {
        // شروع Transaction برای اطمینان از صحت عملیات دیتابیس
        await client.query('BEGIN');

        // 1. درج اطلاعات فایل در جدول assets
        const assetResult = await client.query(
            `INSERT INTO assets (title, description, file_url, asset_type, file_size_kb, usage_type, uploaded_by)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [title, `/uploads/${finalFilename}`, file.mimetype, fileSizeKb, usage_type, uploaded_by]
        );
        const newAsset = assetResult.rows[0];

        // 2. اگر فایل مربوط به یک رویداد خاص است، آن را در جدول event_assets مرتبط می‌کنیم
        if (event_id) {
            await client.query(
                'INSERT INTO event_assets (event_id, asset_id) VALUES ($1, $2)',
                [event_id, newAsset.id]
            );
        }

        // اگر همه چیز موفق بود، تغییرات را نهایی کن
        await client.query('COMMIT');
        return newAsset;

    } catch (error) {
        // در صورت بروز هرگونه خطا، تمام تغییرات را به حالت اول برگردان
        await client.query('ROLLBACK');
        
        // فایل فیزیکی آپلود شده را نیز از روی سرور پاک می‌کنیم تا فایل یتیم باقی نماند
        await fs.unlink(finalFilePath).catch(err => console.error("Failed to cleanup orphaned file:", err));
        
        // خطا را برای کنترلر ارسال می‌کنیم تا به کاربر پاسخ مناسب دهد
        throw error;
    } finally {
        // آزادسازی کانکشن دیتابیس در هر صورت
        client.release();
    }
};

/**
 * یافتن تمام Asset ها با قابلیت فیلتر
 * @param {object} filters - فیلترها (مثال: { usage_type: 'gallery_image' })
 * @returns {Promise<Array>} - آرایه‌ای از آبجکت‌های asset
 */
const findAll = async (filters = {}) => {
    // این تابع در آینده برای ساخت کتابخانه رسانه مرکزی استفاده خواهد شد
    const result = await pool.query('SELECT * FROM assets ORDER BY created_at DESC');
    return result.rows;
};

/**
 * یافتن تمام Asset های مرتبط با یک رویداد خاص از طریق slug
 * @param {string} eventSlug - اسلاگ رویداد
 * @param {object} filters - فیلترهای اضافی (مثال: { usage_type: 'gallery_image' })
 * @returns {Promise<Array>} - آرایه‌ای از آبجکت‌های asset
 */
const findByEventSlug = async (eventSlug, filters = {}) => {
    let query = `
        SELECT a.* FROM assets a
        JOIN event_assets ea ON a.id = ea.asset_id
        JOIN events e ON ea.event_id = e.id
        WHERE e.slug = $1
    `;
    const queryParams = [eventSlug];
    let paramIndex = 2;

    if (filters.usage_type) {
        query += ` AND a.usage_type = $${paramIndex++}`;
        queryParams.push(filters.usage_type);
    }
    
    query += ' ORDER BY a.created_at DESC';

    const result = await pool.query(query, queryParams);
    return result.rows;
};

/**
 * حذف یک asset از دیتابیس و فایل فیزیکی آن از سرور
 * @param {number} id - شناسه (ID) asset
 * @returns {Promise<object>} - آبجکت asset حذف شده
 */
const deleteById = async (id) => {
    // ابتدا اطلاعات asset را از دیتابیس می‌گیریم تا به مسیر فایل آن دسترسی داشته باشیم
    const assetResult = await pool.query('SELECT * FROM assets WHERE id = $1', [id]);
    const assetToDelete = assetResult.rows[0];

    if (!assetToDelete) {
        return null; // اگر asset پیدا نشد
    }

    // حذف رکورد از دیتابیس (به دلیل وجود ON DELETE CASCADE، رکوردهای مرتبط در event_assets نیز حذف می‌شوند)
    await pool.query('DELETE FROM assets WHERE id = $1', [id]);

    // حذف فایل فیزیکی از پوشه /public/uploads
    const filePath = path.join(__dirname, `../../../public${assetToDelete.file_url}`);
    await fs.unlink(filePath).catch(err => console.error(`Failed to delete physical file: ${filePath}`, err));
    
    return assetToDelete;
};

module.exports = {
    create,
    findAll,
    findByEventSlug,
    deleteById,
};