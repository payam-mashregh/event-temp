// upto/frontend/pages/manage/events/[slug]/news/[newsId]/edit.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import EventManagementLayout from '../../../../../../components/layout/EventManagementLayout';
import useAuth from '../../../../../../hooks/useAuth';
import api from '../../../../../../lib/api';
import toast from 'react-hot-toast';
import RichTextEditor from '../../../../../../components/ui/RichTextEditor';

export default function EditNewsItemPage() {
    const router = useRouter();
    const { slug, newsId } = router.query;
    const { isAuthenticated } = useAuth();

    const [event, setEvent] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!slug || !newsId || !isAuthenticated) return;
            setLoading(true);
            try {
                const [eventRes, newsItemRes] = await Promise.all([
                    api.get(`/events/${slug}`),
                    api.get(`/news/${newsId}`) // فرض بر وجود API برای دریافت یک خبر با شناسه
                ]);
                setEvent(eventRes.data);
                setTitle(newsItemRes.data.title);
                setContent(newsItemRes.data.content);
            } catch (error) {
                toast.error('خطا در دریافت اطلاعات برای ویرایش.');
                console.error("Fetch data error:", error);
                router.push(`/manage/events/${slug}/news`);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug, newsId, isAuthenticated, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const toastId = toast.loading('در حال به‌روزرسانی خبر...');

        try {
            await api.put(`/news/${newsId}`, { title, content });
            toast.success('خبر با موفقیت به‌روزرسانی شد!', { id: toastId });
            router.push(`/manage/events/${slug}/news`);
        } catch (error) {
            toast.error('خطا در به‌روزرسانی خبر.', { id: toastId });
            console.error('Update error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <EventManagementLayout eventName="در حال بارگذاری...">
                <p>در حال بارگذاری ویرایشگر اخبار...</p>
            </EventManagementLayout>
        );
    }

    return (
        <EventManagementLayout eventName={event?.name}>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow" dir="rtl">
                <div>
                    <h2 className="text-xl font-bold">ویرایش آیتم خبر</h2>
                </div>
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">عنوان</label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">محتوا</label>
                    <div className="mt-1">
                        <RichTextEditor value={content} onChange={setContent} />
                    </div>
                </div>
                <div className="flex justify-end gap-x-4 pt-4">
                    <button 
                        type="button" 
                        onClick={() => router.back()} 
                        className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        انصراف
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:bg-indigo-400"
                    >
                        {isSubmitting ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                    </button>
                </div>
            </form>
        </EventManagementLayout>
    );
}