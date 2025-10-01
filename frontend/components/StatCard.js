// upto/frontend/components/StatCard.js

// ما تمام import های غیرضروری را حذف کرده و از تگ‌های استاندارد استفاده می‌کنیم.
export default function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
      <div className="flex items-center">
        {/* در اینجا می‌توانید یک آیکون نمایش دهید اگر پراپ icon ارسال شود */}
        {icon && <div className="mr-4">{icon}</div>}
        <div>
          <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}