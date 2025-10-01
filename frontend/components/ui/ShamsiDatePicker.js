// upto/frontend/components/ui/ShamsiDatePicker.js
import React from 'react';
import DatePicker, { utils } from 'react-modern-calendar-datepicker';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';

const ShamsiDatePicker = ({ value, onChange, ...props }) => {
  // این تابع مقدار انتخاب شده را به فرمت استاندارد Date تبدیل می‌کند
  const handleDateChange = (dateObject) => {
    if (!dateObject) {
      onChange(null);
      return;
    }
    const { year, month, day } = dateObject;
    const standardDate = new Date(year, month - 1, day);
    onChange(standardDate);
  };

  // این تابع مقدار Date استاندارد را به فرمت مورد نیاز کتابخانه تبدیل می‌کند
  const getSelectedDay = () => {
    if (!value) return null;
    const date = new Date(value);
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  };

  return (
    <DatePicker
      value={getSelectedDay()}
      onChange={handleDateChange}
      locale="fa" // فعال‌سازی تقویم و زبان فارسی
      shouldHighlightWeekends
      calendarClassName="responsive-calendar" // کلاس برای استایل‌دهی سفارشی
      inputPlaceholder="تاریخ را انتخاب کنید"
      inputClassName="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      {...props}
    />
  );
};

export default ShamsiDatePicker;