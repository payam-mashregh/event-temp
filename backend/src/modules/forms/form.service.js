// backend/src/modules/forms/form.service.js
const Form = require('./form.model');

/**
 * بر اساس تعریف JSON ارسال شده، یک فرم را ایجاد یا به‌روزرسانی می‌کند
 */
const createOrUpdateForm = async (event_id, formData) => {
    // ما انتظار داریم که ساختار فرم در یک کلید به نام formDefinition ارسال شود
    const { formDefinition } = formData;
    if (!formDefinition) {
        throw new Error('ساختار فرم (formDefinition) ارسال نشده است.');
    }

    // بررسی می‌کنیم آیا فرمی برای این رویداد از قبل وجود دارد یا خیر
    let form = await Form.findFormByEventId(event_id);

    if (form) {
        // اگر فرم وجود داشت، ساختار JSON آن را آپدیت می‌کنیم
        return Form.updateFormDefinition(form.id, formDefinition);
    } else {
        // اگر وجود نداشت، یک فرم جدید با این ساختار می‌سازیم
        return Form.createFormWithDefinition(event_id, formDefinition);
    }
};

/**
 * فرم یک رویداد را بر اساس شناسه آن دریافت می‌کند
 */
const getFormByEventId = (eventId) => {
    return Form.findFormByEventId(eventId);
};

module.exports = {
    createOrUpdateForm,
    getFormByEventId,
};