// upto/frontend/pages/manage/events/[slug]/edit.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import EventManagementLayout from '../../../../components/layout/EventManagementLayout';
import useAuth from '../../../../hooks/useAuth';
import api from '../../../../lib/api';
import toast from 'react-hot-toast';
import { Switch } from '@headlessui/react';

export default function EditEventPage() {
    const router = useRouter();
    const { slug } = router.query;
    const { isAuthenticated } = useAuth();
    const [event, setEvent] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        topic: '',
        location: '',
        start_date: '',
        end_date: '',
        description: '',
        is_active: true,
        website_url: '',
    });
    const [posterFile, setPosterFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getAssetUrl = (path) => path ? `${process.env.NEXT_PUBLIC_API_URL.replace('/api', '')}${path}` : null;

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
            return date.toISOString().slice(0, 16);
        } catch (error) {
            return '';
        }
    };

    useEffect(() => {
        const fetchEvent = async () => {
            if (!slug || !isAuthenticated) return;
            setLoading(true);
            try {
                const response = await api.get(`/events/${slug}`);
                const eventData = response.data;
                setEvent(eventData);
                setFormData({
                    name: eventData.name || '',
                    topic: eventData.topic || '',
                    location: eventData.location || '',
                    start_date: formatDateForInput(eventData.start_date),
                    end_date: formatDateForInput(eventData.end_date),
                    description: eventData.description || '',
                    is_active: eventData.is_active,
                    website_url: eventData.website_url || '',
                });
            } catch (error) {
                toast.error('خطا در دریافت اطلاعات رویداد.');
                router.push('/manage/events');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [slug, isAuthenticated, router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setPosterFile(e.target.files[0]);
    };

    const handleSwitchChange = (value) => {
        setFormData(prev => ({ ...prev, is_active: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const toastId = toast.loading('در حال به‌روزرسانی رویداد...');

        const submissionData = new FormData();
        for (const key in formData) {
            submissionData.append(key, formData[key]);
        }
        if (posterFile) {
            submissionData.append('poster_file', posterFile);
        }

        try {
            // نکته: API شما برای به‌روزرسانی از id استفاده می‌کند، نه slug
            const response = await api.put(`/events/${event.id}`, submissionData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('رویداد با موفقیت به‌روزرسانی شد!', { id: toastId });
            // پس از به‌روزرسانی موفق، به داشبورد همان رویداد (با اسلاگ جدید احتمالی) برمی‌گردیم
            router.push(`/manage/events/${response.data.slug}/dashboard`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'خطا در به‌روزرسانی رویداد.', { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <EventManagementLayout eventName="در حال بارگذاری...">
                <p>در حال بارگذاری فرم ویرایش...</p>
            </EventManagementLayout>
        );
    }

    return (
        <EventManagementLayout eventName={event?.name}>
            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-lg shadow-md" dir="rtl">
                <div className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">نام رویداد</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label htmlFor="poster_file" className="block text-sm font-medium text-gray-700">تغییر پوستر</label>
                        {event?.poster_url && !posterFile && (
                            <div className="mt-2">
                                <img src={getAssetUrl(event.poster_url)} alt="Current Poster" className="h-40 w-auto rounded-md shadow-sm" />
                            </div>
                        )}
                        <input type="file" name="poster_file" id="poster_file" onChange={handleFileChange} accept="image/*" className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
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
                            <Switch checked={formData.is_active} onChange={handleSwitchChange} className={`${formData.is_active ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2`}>
                                <span className={`${formData.is_active ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
                            </Switch>
                            <Switch.Label as="span" className="mr-3 text-sm">
                                <span className="font-medium text-gray-900">رویداد فعال است</span>
                            </Switch.Label>
                        </Switch.Group>
                    </div>
                </div>
                <div className="pt-5">
                    <div className="flex justify-end">
                        <button type="button" onClick={() => router.back()} className="rounded-md bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                            انصراف
                        </button>
                        <button type="submit" disabled={isSubmitting} className="mr-3 inline-flex justify-center rounded-md bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:bg-indigo-400">
                            {isSubmitting ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                        </button>
                    </div>
                </div>
            </form>
        </EventManagementLayout>
    );
}