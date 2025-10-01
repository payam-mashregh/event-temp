// upto/frontend/pages/manage/dashboard.js
import ManagementLayout from '../../components/layout/ManagementLayout';
import useAuth from '../../hooks/useAuth';
import StatCard from '../../components/StatCard'; // وارد کردن کامپوننت اصلاح‌شده

// یک آیکون نمونه برای نمایش
const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.184-1.268-.5-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.184-1.268.5-1.857m0 0a5.002 5.002 0 019 0" />
    </svg>
);

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        داشبورد
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        خوش آمدید، {user?.fullName || 'کاربر گرامی'}!
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="تعداد رویدادها" value="12" />
        <StatCard title="شرکت‌کنندگان جدید" value="256" icon={<UsersIcon />} />
        <StatCard title="پیام‌های خوانده نشده" value="8" />
        <StatCard title="درآمد کل (تومان)" value="۴۵,۰۰۰,۰۰۰" />
      </div>
    </div>
  );
}

DashboardPage.getLayout = function getLayout(page) {
  return <ManagementLayout>{page}</ManagementLayout>;
};