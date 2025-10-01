// upto/frontend/pages/manage/events/[slug]/assets.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ManagementLayout from '../../../../components/layout/ManagementLayout';
import FileUploader from '../../../../components/FileUploader'; // کامپوننت آپلودر که بعداً اصلاح می‌شود
import toast from 'react-hot-toast';

// کامپوننت کوچک برای نمایش هر فایل
const AssetItem = ({ asset, onDelete }) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL.replace('/api', '');

  return (
    <div className="relative group border rounded-lg overflow-hidden">
      <img src={`${API_URL}${asset.file_url}`} alt={asset.title} className="w-full h-40 object-cover" />
      <div className="p-2">
        <p className="font-bold text-sm truncate">{asset.title}</p>
        <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block mt-1">{asset.usage_type}</p>
      </div>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onDelete(asset.id)} className="bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};


export default function EventAssetsPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [event, setEvent] = useState(null);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Fetch event details to get the ID
  useEffect(() => {
    if (slug) {
      const fetchEvent = async () => {
        try {
          const res = await fetch(`/api/events/slug/${slug}`); // فرض بر وجود این API
          if (!res.ok) throw new Error('Failed to fetch event details');
          const data = await res.json();
          setEvent(data);
        } catch (error) {
          toast.error("Could not load event data.");
        }
      };
      fetchEvent();
    }
  }, [slug]);
  
  // Fetch all assets for the event
  useEffect(() => {
    if (event) {
      const fetchAssets = async () => {
        setLoading(true);
        try {
          const res = await fetch(`/api/assets?eventId=${event.id}`);
          if (!res.ok) throw new Error('Failed to fetch assets');
          const data = await res.json();
          setAssets(data);
        } catch (error) {
          toast.error(error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchAssets();
    }
  }, [event]);

  const handleUploadSuccess = (newAsset) => {
    setAssets(prev => [newAsset, ...prev]);
    setUploadModalOpen(false);
    toast.success("File uploaded successfully!");
  };

  const handleDeleteAsset = async (assetId) => {
    if (!confirm('Are you sure you want to delete this asset? This action cannot be undone.')) {
        return;
    }

    try {
        const token = "YOUR_JWT_TOKEN"; // باید از context گرفته شود
        const res = await fetch(`/api/assets/${assetId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to delete asset');
        }

        setAssets(prev => prev.filter(asset => asset.id !== assetId));
        toast.success('Asset deleted successfully.');
    } catch (error) {
        toast.error(`Error: ${error.message}`);
    }
  };


  if (!event && loading) return <div>Loading event...</div>;

  return (
    <ManagementLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Asset Library for: {event?.name}</h1>
          <button onClick={() => setUploadModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Upload New Asset
          </button>
        </div>

        {loading ? (
          <p>Loading assets...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {assets.map(asset => (
              <AssetItem key={asset.id} asset={asset} onDelete={handleDeleteAsset} />
            ))}
          </div>
        )}
        
        {assets.length === 0 && !loading && (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">No assets found.</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by uploading a new asset.</p>
            </div>
        )}
      </div>

      {uploadModalOpen && event && (
        <FileUploader
          eventId={event.id}
          onClose={() => setUploadModalOpen(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      )}
    </ManagementLayout>
  );
}

EventAssetsPage.getLayout = function getLayout(page) {
  return <ManagementLayout>{page}</ManagementLayout>;
};