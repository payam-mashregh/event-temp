// upto/frontend/pages/manage/events/new.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import ManagementLayout from '../../../components/layout/ManagementLayout';
import useAuth from '../../../hooks/useAuth';
import api from '../../../lib/api';
import toast from 'react-hot-toast';
import { Switch } from '@headlessui/react';

export default function NewEventPage() {
    const [formData, setFormData] = useState({ name: '', topic: '', location: '', start_date: '', end_date: '', description: '', is_active: true, website_url: '' });
    const [posterFile, setPosterFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const handleFileChange = (e) => {
        setPosterFile(e.target.files[0]);
    };

    const handleSwitchChange = (value) => {
        setFormData(prev => ({ ...prev, is_active: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) return;
        setIsSubmitting(true);
        const toastId = toast.loading('در حال ایجاد رویداد...');

        const submissionData = new FormData();
        // اضافه کردن تمام داده‌های فرم به FormData
        for (const key in formData) {
            submissionData.append(key, formData[key]);
        }
        // اگر فایلی انتخاب شده بود، آن را نیز اضافه کن
        if (posterFile) {
            submissionData.append('poster_file', posterFile);
        }

        try {
            const response = await api.post('/events', submissionData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('رویداد با موفقیت ایجاد شد!', { id: toastId });
            router.push(`/manage/events/${response.data.slug}/dashboard`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'خطا در ایجاد رویداد.', { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ManagementLayout>
            <div dir="rtl">
                <div className="border-b border-gray-200 pb-5">
                    <h1 className="text-2xl font-bold leading-6 text-gray-900">ایجاد رویداد جدید</h1>
                    <p className="mt-2 text-sm text-gray-500">اطلاعات اولیه رویداد خود را در این فرم وارد کنید.</p>
                </div>
                <form onSubmit={handleSubmit} className="mt-8 space-y-8 bg-white p-8 rounded-lg shadow-md">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">نام رویداد</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label htmlFor="poster_file" className="block text-sm font-medium text-gray-700">پوستر رویداد</label>
                            <input type="file" name="poster_file" id="poster_file" onChange={handleFileChange} accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                        </div>
                        <div>
                            <label htmlFor="topic" className="block text-sm font-medium text-gray-700">موضوع</label>
                            <input type="text" name="topic" id="topic" value={formData.topic} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">مکان برگزاری</label>
                            <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label htmlFor="website_url" className="block text-sm font-medium text-gray-700">آدرس وب‌سایت</label>
                            <input type="url" name="website_url" id="website_url" value={formData.website_url} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">تاریخ و زمان شروع</label>
                                <input type="datetime-local" name="start_date" id="start_date" value={formData.start_date} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                            </div>
                            <div>
                                <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">تاریخ و زمان پایان</label>
                                <input type="datetime-local" name="end_date" id="end_date" value={formData.end_date} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">توضیحات کوتاه</label>
                            <textarea name="description" id="description" rows="4" value={formData.description} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
                        </div>
                        <div>
                            <Switch.Group as="div" className="flex items-center">
                                <Switch checked={formData.is_active} onChange={handleSwitchChange} className={`${formData.is_active ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2`}><span className={`${formData.is_active ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} /></Switch>
                                <Switch.Label as="span" className="mr-3 text-sm"><span className="font-medium text-gray-900">رویداد فعال باشد</span></Switch.Label>
                            </Switch.Group>
                        </div>
                    </div>
                    <div className="pt-5">
                        <div className="flex justify-end">
                            <button type="button" onClick={() => router.push('/manage/events')} className="rounded-md bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">انصراف</button>
                            <button type="submit" disabled={isSubmitting} className="mr-3 inline-flex justify-center rounded-md bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:bg-indigo-400">{isSubmitting ? 'در حال ایجاد...' : 'ایجاد رویداد'}</button>
                        </div>
                    </div>
                </form>
            </div>
        </ManagementLayout>
    );
}