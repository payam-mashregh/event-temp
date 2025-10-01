// frontend/components/AssetPickerModal.js
import { useState, useEffect } from 'react';

export default function AssetPickerModal({ isOpen, onClose, onAssetSelect, assetType, linkedAssetIds }) {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    // --- START: MODIFICATION ---
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const backendUrl = apiUrl.replace('/api', '');
    // --- END: MODIFICATION ---

    useEffect(() => {
        if (isOpen) {
            const fetchAssets = async () => {
                setLoading(true);
                setError('');
                try {
                    const token = localStorage.getItem('token');
                    // --- START: MODIFICATION ---
                    // Use the full API URL to fetch assets from the backend
                    const res = await fetch(`${apiUrl}/assets`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    // --- END: MODIFICATION ---
                    if (!res.ok) throw new Error('Failed to fetch assets.');
                    const data = await res.json();
                    setAssets(data || []);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchAssets();
        }
    }, [isOpen, apiUrl]); // Added apiUrl to dependency array

    const filteredAssets = assets
        .filter(asset => assetType ? asset.asset_type === assetType : true)
        .filter(asset => asset.title.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">انتخاب فایل از کتابخانه</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
                </div>
                <div className="p-4 border-b">
                    <input
                        type="text"
                        placeholder="جستجو در میان فایل‌ها..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {loading ? (
                        <p>در حال بارگذاری فایل‌ها...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : filteredAssets.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredAssets.map(asset => {
                                const isLinked = linkedAssetIds && linkedAssetIds.includes(asset.id);
                                return (
                                    <div 
                                        key={asset.id} 
                                        className={`border rounded-lg overflow-hidden cursor-pointer ${isLinked ? 'border-gray-400 opacity-60' : 'hover:border-primary'}`}
                                        onClick={() => !isLinked && onAssetSelect(asset)}
                                        title={isLinked ? 'این فایل قبلاً متصل شده است' : asset.title}
                                    >
                                        <div className="h-32 bg-gray-100 flex items-center justify-center">
                                            {asset.asset_type === 'image' ? (
                                                <img src={`${backendUrl}${asset.file_url}`} alt={asset.title} className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="text-gray-500">پیش‌نمایش موجود نیست</span>
                                            )}
                                        </div>
                                        <div className="p-2">
                                            <p className="text-sm font-medium truncate">{asset.title}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p>هیچ فایلی یافت نشد. می‌توانید از صفحه <a href="/manage/library" className="text-primary hover:underline">کتابخانه</a> فایل جدید آپلود کنید.</p>
                    )}
                </div>
                <div className="p-4 border-t flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                        بستن
                    </button>
                </div>
            </div>
        </div>
    );
}