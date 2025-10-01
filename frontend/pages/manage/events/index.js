// upto/frontend/pages/manage/events/index.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ManagementLayout from '../../../components/layout/ManagementLayout';
import useAuth from '../../../hooks/useAuth';
import api from '../../../lib/api';
import toast from 'react-hot-toast';

export default function EventsListPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchMyEvents = async () => {
            if (!isAuthenticated) return;
            setLoading(true);
            try {
                // این API اکنون باید به درستی پاسخ دهد
                const response = await api.get('/events/my-events');
                setEvents(response.data);
            } catch (error) {
                toast.error('خطا در دریافت لیست رویدادها.');
                console.error("Failed to fetch events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyEvents();
    }, [isAuthenticated]);

    return (
        <div dir="rtl">
            <div className="sm:flex sm:items-center mb-6">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-bold leading-6 text-gray-900">مدیریت رویدادها</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        لیست تمام رویدادهایی که شما مدیریت می‌کنید.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <Link href="/manage/events/new" className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
                        ایجاد رویداد جدید
                    </Link>
                </div>
            </div>

            {loading ? (
                <p>در حال بارگذاری لیست رویدادها...</p>
            ) : (
                <div className="flow-root mt-8">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead>
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-right text-sm font-semibold text-gray-900 sm:pl-0">نام رویداد</th>
                                        <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">موضوع</th>
                                        <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">وضعیت</th>
                                        <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">تاریخ شروع</th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0"><span className="sr-only">مدیریت</span></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {events.length > 0 ? (
                                        events.map((event) => (
                                            <tr key={event.id}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{event.name}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{event.topic || '-'}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${event.is_active ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10'}`}>
                                                        {event.is_active ? 'فعال' : 'غیرفعال'}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {event.start_date ? new Date(event.start_date).toLocaleDateString('fa-IR') : '-'}
                                                </td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-left text-sm font-medium sm:pr-0">
                                                    <Link href={`/manage/events/${event.slug}/dashboard`} className="text-indigo-600 hover:text-indigo-900">
                                                        مدیریت<span className="sr-only">, {event.name}</span>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-10 text-gray-500">
                                                هنوز هیچ رویدادی توسط شما مدیریت نمی‌شود.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

EventsListPage.getLayout = function getLayout(page) {
    return <ManagementLayout>{page}</ManagementLayout>;
};