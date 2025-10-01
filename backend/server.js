// upto/backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./src/config/db');
const apiRoutes = require('./src/api');

// --- START: Session Management ---
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);

const app = express();

// --- Dynamic CORS Configuration ---
const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS ? process.env.CORS_ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // اجازه ارسال کوکی‌ها از طرف فرانت‌اند
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// به سرور می‌گوییم که به پروکسی اعتماد کند (مهم برای استقرار در محیط عملیاتی)
app.set('trust proxy', 1);

// --- Session Middleware Setup ---
app.use(session({
    store: new pgSession({
        pool: pool,                // کانکشن دیتابیس
        tableName: 'user_sessions', // نام جدولی که ایجاد کردید
    }),
    secret: process.env.SESSION_SECRET, // عبارت مخفی از فایل .env
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // کوکی فقط روی HTTPS ارسال شود
        httpOnly: true, // جلوگیری از دسترسی جاوااسکریپت به کوکی
        maxAge: 30 * 24 * 60 * 60 * 1000 // اعتبار: ۳۰ روز
    }
}));

// Middleware
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// API Routes
app.use('/api', apiRoutes);

// Database Test Route
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.send(`Database connection successful! Current time is: ${result.rows[0].now}`);
  } catch (error) {
    console.error('Database connection failed', error);
    res.status(500).send('Database connection failed');
  }
});

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});