// upto/frontend/pages/manage/events/[slug]/dashboard.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import EventManagementLayout from '../../../../components/layout/EventManagementLayout';
import useAuth from '../../../../hooks/useAuth';
import api from '../../../../lib/api';
import StatCard from '../../../../components/StatCard';
import toast from 'react-hot-toast';
import { UsersIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default function EventDashboardPage() {
    const [event, setEvent] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { slug } = router.query;
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            // فقط در صورتی که اسلاگ و وضعیت احراز هویت مشخص باشد، درخواست را ارسال کن
            if (!slug || !isAuthenticated) return;
            
            setLoading(true);
            try {
                // ما اطلاعات رویداد و آمار آن را به صورت همزمان دریافت می‌کنیم تا سرعت لود صفحه بیشتر شود
                const [eventRes, statsRes] = await Promise.all([
                    api.get(`/events/${slug}`),
                    api.get(`/events/${slug}/stats`)
                ]);
                
                setEvent(eventRes.data);
                setStats(statsRes.data);

            } catch (error) {
                toast.error('خطا در دریافت اطلاعات داشبورد رویداد.');
                console.error("Failed to fetch event dashboard data:", error);
                // در صورت خطا، کاربر را به صفحه لیست رویدادها برمی‌گردانیم
                router.push('/manage/events');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug, isAuthenticated, router]);

    // در حالت لودینگ، یک چیدمان اولیه نمایش می‌دهیم
    if (loading) {
        return (
            <EventManagementLayout eventName="در حال بارگذاری...">
                <p>در حال بارگذاری اطلاعات داشبورد رویداد...</p>
            </EventManagementLayout>
        );
    }

    // اگر به هر دلیلی رویداد پیدا نشد
    if (!event) {
        return (
            <EventManagementLayout>
                <div className="text-center py-10">
                    <h2 className="text-xl font-semibold text-red-600">خطا</h2>
                    <p className="mt-2 text-gray-500">اطلاعات این رویداد یافت نشد یا شما دسترسی لازم را ندارید.</p>
                </div>
            </EventManagementLayout>
        );
    }

    return (
        <EventManagementLayout eventName={event.name}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="تعداد شرکت کنندگان" 
                    value={stats?.registration_count || '0'} 
                    icon={<UsersIcon className="h-8 w-8 text-blue-500" />}
                />
                <StatCard 
                    title="پیام‌های جدید" 
                    value={stats?.unread_messages_count || '0'} 
                    icon={<EnvelopeIcon className="h-8 w-8 text-green-500" />}
                />
                {/* شما می‌توانید کارت‌های آماری بیشتری را در اینجا اضافه کنید.
                  مثال:
                  <StatCard title="تعداد بازدیدها" value={stats?.view_count || '0'} />
                  <StatCard title="تعداد حامیان" value={stats?.sponsor_count || '0'} />
                */}
            </div>
            <div className="mt-8">
                {/* در این بخش می‌توانید نمودارها، آخرین فعالیت‌ها یا لینک‌های سریع را اضافه کنید.
                  مثال:
                  <div className="bg-white shadow rounded-lg p-6">
                      <h3 className="text-lg font-medium">فعالیت‌های اخیر</h3>
                      <ul>...</ul>
                  </div>
                */}
            </div>
        </EventManagementLayout>
    );
}