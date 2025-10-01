import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import EventManagementLayout from '../../../../components/layout/EventManagementLayout';
import useAuth from '../../../../hooks/useAuth';
import api from '../../../../lib/api';
import toast from 'react-hot-toast';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function EventNewsPage() {
    const router = useRouter();
    const { slug } = router.query;
    const { isAuthenticated } = useAuth();
    const [event, setEvent] = useState(null);
    const [newsItems, setNewsItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!slug || !isAuthenticated) return;
            setLoading(true);
            try {
                const [eventRes, newsRes] = await Promise.all([
                    api.get(`/events/${slug}`),
                    api.get(`/news?eventSlug=${slug}`) // Assuming an endpoint to get news by event slug
                ]);
                setEvent(eventRes.data);
                setNewsItems(newsRes.data);
            } catch (error) {
                toast.error('Failed to fetch event or news data.');
                console.error("Fetch data error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug, isAuthenticated]);

    const handleDelete = async (newsId) => {
        if (!confirm('Are you sure you want to delete this news item?')) return;
        
        const toastId = toast.loading('Deleting news item...');
        try {
            await api.delete(`/news/${newsId}`);
            setNewsItems(prev => prev.filter(item => item.id !== newsId));
            toast.success('News item deleted successfully.', { id: toastId });
        } catch (error) {
            toast.error('Failed to delete news item.', { id: toastId });
            console.error('Delete error:', error);
        }
    };

    if (loading) {
        return (
            <EventManagementLayout eventName="Loading...">
                <p>Loading news management...</p>
            </EventManagementLayout>
        );
    }
    
    return (
        <EventManagementLayout eventName={event?.name}>
            <div dir="rtl">
                <div className="sm:flex sm:items-center mb-6">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl font-semibold leading-6 text-gray-900">News Management</h1>
                        <p className="mt-2 text-sm text-gray-700">Manage all news items for this event.</p>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <Link
                            href={`/manage/events/${slug}/news/new`}
                            className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                        >
                            <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                            Create New Item
                        </Link>
                    </div>
                </div>

                <div className="flow-root mt-8">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <ul role="list" className="divide-y divide-gray-200">
                                {newsItems.length > 0 ? (
                                    newsItems.map((item) => (
                                        <li key={item.id} className="flex justify-between items-center gap-x-6 py-5 px-2 hover:bg-gray-50">
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold leading-6 text-gray-900">{item.title}</p>
                                                <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                                                    Published on: {new Date(item.published_at).toLocaleDateString('en-US')}
                                                </p>
                                            </div>
                                            <div className="flex flex-none items-center gap-x-4">
                                                <Link href={`/manage/events/${slug}/news/${item.id}/edit`} className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                                    Edit
                                                </Link>
                                                <button onClick={() => handleDelete(item.id)} className="rounded-md bg-red-50 px-2.5 py-1.5 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-100">
                                                    Delete
                                                </button>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-center py-10 text-gray-500">No news items found for this event.</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </EventManagementLayout>
    );
}