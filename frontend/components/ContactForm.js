// upto/frontend/components/ContactForm.js
import { useState } from 'react';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function ContactForm({ eventId }) {
    const [formData, setFormData] = useState({ fullName: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const toastId = toast.loading('در حال ارسال پیام...');
        try {
            await api.post('/contact', { ...formData, eventId });
            toast.success('پیام شما با موفقیت ارسال شد.', { id: toastId });
            setFormData({ fullName: '', email: '', message: '' }); // Reset form
        } catch (error) {
            toast.error('خطا در ارسال پیام.', { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mx-auto max-w-2xl text-center">
            <h3 className="text-2xl font-bold mb-4">ارسال پیام</h3>
            <p className="text-gray-600 mb-8">سوالات و پیشنهادات خود را از طریق فرم زیر با ما در میان بگذارید.</p>
            <form onSubmit={handleSubmit} className="space-y-4 text-right">
                <div>
                    <label htmlFor="fullName" className="sr-only">نام کامل</label>
                    <input type="text" name="fullName" id="fullName" value={formData.fullName} onChange={handleChange} required placeholder="نام کامل" className="w-full rounded-md border-gray-300"/>
                </div>
                <div>
                    <label htmlFor="email" className="sr-only">ایمیل</label>
                    <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required placeholder="آدرس ایمیل" className="w-full rounded-md border-gray-300"/>
                </div>
                <div>
                    <label htmlFor="message" className="sr-only">پیام شما</label>
                    <textarea name="message" id="message" value={formData.message} onChange={handleChange} required rows="4" placeholder="پیام شما" className="w-full rounded-md border-gray-300"></textarea>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full rounded-md bg-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:bg-indigo-400">
                    {isSubmitting ? 'در حال ارسال...' : 'ارسال پیام'}
                </button>
            </form>
        </div>
    );
}