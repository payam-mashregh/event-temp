// upto/frontend/components/layout/EventManagementLayout.js
import { Fragment } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ManagementLayout from './ManagementLayout'; // چیدمان اصلی

const eventTabs = [
    { name: 'داشبورد', href: 'dashboard' },
    { name: 'ویرایش اطلاعات', href: 'edit' },
    { name: 'مدیریت صفحات', href: 'pages' },
    { name: 'اخبار', href: 'news' },
    { name: 'شرکت کنندگان', href: 'participants' },
    { name: 'فرم ثبت نام', href: 'registration' },
    { name: 'حامیان مالی', href: 'sponsors' },
    { name: 'زمان‌بندی', href: 'timeline' },
    { name: 'کتابخانه رسانه', href: 'assets' },
    { name: 'پیام‌ها', href: 'messages' },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function EventManagementLayout({ children, eventName }) {
    const router = useRouter();
    const { slug } = router.query;
    const currentTab = router.pathname.split('/').pop();

    return (
        <ManagementLayout>
            <div dir="rtl">
                <div className="border-b border-gray-200 pb-5 sm:pb-0">
                    <h1 className="text-2xl font-bold leading-6 text-gray-900">
                        مدیریت رویداد: {eventName || '...'}
                    </h1>
                    <div className="mt-3 sm:mt-4">
                        <div className="sm:hidden">
                            <label htmlFor="current-tab" className="sr-only">انتخاب تب</label>
                            <select
                                id="current-tab"
                                name="current-tab"
                                className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                defaultValue={eventTabs.find((tab) => tab.href === currentTab)?.href}
                                onChange={(e) => router.push(`/manage/events/${slug}/${e.target.value}`)}
                            >
                                {eventTabs.map((tab) => (
                                    <option key={tab.name} value={tab.href}>{tab.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="hidden sm:block">
                            <nav className="-mb-px flex space-x-8 rtl:space-x-reverse">
                                {eventTabs.map((tab) => (
                                    <Link
                                        key={tab.name}
                                        href={`/manage/events/${slug}/${tab.href}`}
                                        className={classNames(
                                            tab.href === currentTab
                                                ? 'border-indigo-500 text-indigo-600'
                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                            'whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium'
                                        )}
                                    >
                                        {tab.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>
                <div className="mt-8">
                    {children}
                </div>
            </div>
        </ManagementLayout>
    );
}