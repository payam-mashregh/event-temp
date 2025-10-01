// upto/frontend/lib/api.js
import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // --- START: Critical Fix ---
  // این گزینه به axios می‌گوید که کوکی‌ها را در تمام درخواست‌های بین دامنه‌ای ارسال کند.
  // این کار برای عملکرد صحیح نشست (session) و کپچا ضروری است.
  withCredentials: true,
  // --- END: Critical Fix ---
});

api.interceptors.request.use(config => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
},
error => {
    return Promise.reject(error);
});

export default api;