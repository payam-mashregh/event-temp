// backend/scripts/create-admin.js
const bcrypt = require('bcryptjs');
const pool = require('../src/config/db'); // استفاده از کانفیگ دیتابیس پروژه

// تابع اصلی برای ساخت ادمین
const createAdmin = async () => {
  // دریافت آرگومان‌ها از خط فرمان
  const args = process.argv.slice(2);
  if (args.length !== 3) {
    console.error('❌ خطا: لطفاً دستور را به شکل صحیح وارد کنید:');
    console.error('node scripts/create-admin.js <username> <password> "<full_name>"');
    process.exit(1);
  }

  const [username, password, fullName] = args;
  const role = 'admin';

  console.log(`⏳ در حال ایجاد کاربر ادمین با نام کاربری: ${username}...`);

  try {
    // هش کردن رمز عبور
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // افزودن کاربر به دیتابیس
    const result = await pool.query(
      'INSERT INTO users (username, password_hash, full_name, role) VALUES ($1, $2, $3, $4) RETURNING id, username, role',
      [username, passwordHash, fullName, role]
    );

    const newUser = result.rows[0];
    console.log('✅ کاربر ادمین با موفقیت ایجاد شد:');
    console.log({
      id: newUser.id,
      username: newUser.username,
      role: newUser.role,
    });

  } catch (err) {
    if (err.code === '23505') { // خطای تکراری بودن نام کاربری
      console.error('❌ خطا: کاربری با این نام کاربری از قبل وجود دارد.');
    } else {
      console.error('❌ خطای پیش‌بینی نشده در ایجاد کاربر:', err.message);
    }
  } finally {
    // بستن اتصال به دیتابیس
    await pool.end();
    console.log('🔌 اتصال به دیتابیس بسته شد.');
  }
};

// اجرای تابع
createAdmin();