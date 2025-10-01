// upto/frontend/pages/manage/library.js
import { useState, useEffect } from 'react';
import ManagementLayout from '../../components/layout/ManagementLayout';
import FileUploader from '../../components/FileUploader';
import api from '../../lib/api'; // <--- استفاده از ماژول api متمرکز
import useAuth from '../../hooks/useAuth'; // <--- این خط اصلاح شد

// کامپوننت کوچک برای نمایش هر آیتم در کتابخانه
const AssetItem = ({ asset, onDelete }) => {
  // baseURL از متغیرهای محیطی خوانده می‌شود تا نیازی به هاردکد کردن نباشد
  const baseURL = process.env.NEXT_PUBLIC_API_URL.replace('/api', '');

  return (
    <div className="relative group border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <img src={`${baseURL}${asset.file_url}`} alt={asset.title} className="w-full h-40 object-cover" />
      <div className="p-3">
        <p className="font-bold text-sm truncate" title={asset.title}>{asset.title}</p>
        <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block mt-2">{asset.usage_type}</p>
      </div>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onDelete(asset.id)} className="bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};


export default function MediaLibraryPage() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const { isAuthenticated } = useAuth(); // <--- اکنون به درستی کار می‌کند

  useEffect(() => {
    const fetchAssets = async () => {
      if (!isAuthenticated) return;
      setLoading(true);
      try {
        const response = await api.get('/assets'); // استفاده از api helper
        setAssets(response.data);
      } catch (error) {
        console.error("Failed to fetch media library:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, [isAuthenticated]);

  const handleUploadSuccess = (newAsset) => {
    setAssets(prev => [newAsset, ...prev]);
    setUploadModalOpen(false);
  };

  const handleDeleteAsset = async (assetId) => {
    if (!confirm('آیا از حذف این فایل مطمئن هستید؟')) return;
    try {
      await api.delete(`/assets/${assetId}`);
      setAssets(prev => prev.filter(asset => asset.id !== assetId));
    } catch (error) {
      console.error("Failed to delete asset:", error);
    }
  };

  return (
    <ManagementLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">کتابخانه رسانه</h1>
          <button onClick={() => setUploadModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            آپلود فایل جدید
          </button>
        </div>

        {loading ? (
          <p>در حال بارگذاری...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {assets.map(asset => (
              <AssetItem key={asset.id} asset={asset} onDelete={handleDeleteAsset} />
            ))}
          </div>
        )}
        
        {assets.length === 0 && !loading && (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">هیچ فایلی یافت نشد.</h3>
                <p className="mt-1 text-sm text-gray-500">با آپلود یک فایل جدید شروع کنید.</p>
            </div>
        )}
      </div>

      {uploadModalOpen && (
        <FileUploader
          onClose={() => setUploadModalOpen(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      )}
    </ManagementLayout>
  );
}

MediaLibraryPage.getLayout = function getLayout(page) {
  return <ManagementLayout>{page}</ManagementLayout>;
};