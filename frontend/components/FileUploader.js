// upto/frontend/components/FileUploader.js
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';
import imageCompression from 'browser-image-compression';

export default function FileUploader({ eventId, onClose, onUploadSuccess }) {
  const { token } = useAuth();
  // State برای نگهداری فایل نهایی (بهینه شده)
  const [file, setFile] = useState(null);
  // State برای نمایش پیش‌نمایش فایل به کاربر
  const [filePreview, setFilePreview] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [usageType, setUsageType] = useState('gallery_image');
  // State برای مدیریت وضعیت پردازش (بهینه‌سازی + آپلود) تا دکمه‌ها غیرفعال شوند
  const [isProcessing, setIsProcessing] = useState(false);

  // این تابع زمانی اجرا می‌شود که کاربر فایلی را انتخاب یا رها کند
  const onDrop = useCallback(async (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;

    setIsProcessing(true);
    const toastId = toast.loading('در حال آماده‌سازی و بهینه‌سازی فایل...');

    try {
      // اگر فایل انتخاب شده از نوع تصویر بود
      if (selectedFile.type.startsWith('image/')) {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true, // برای جلوگیری از فریز شدن صفحه در حین پردازش
        };
        // فایل را با کتابخانه بهینه‌ساز فشرده می‌کنیم
        const compressedFile = await imageCompression(selectedFile, options);
        setFile(compressedFile);
        setFilePreview(URL.createObjectURL(compressedFile));
        toast.success('فایل با موفقیت بهینه شد!', { id: toastId });
      } else {
        // اگر فایل تصویر نبود، همان فایل اصلی را استفاده می‌کنیم
        setFile(selectedFile);
        setFilePreview(URL.createObjectURL(selectedFile));
        toast.success('فایل آماده آپلود است.', { id: toastId });
      }
      // یک عنوان پیش‌فرض از روی نام فایل ایجاد می‌کنیم
      setTitle(selectedFile.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
    } catch (error) {
      toast.error('خطا در بهینه‌سازی فایل.', { id: toastId });
      console.error("Compression Error:", error);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Hook اصلی react-dropzone که منطق Drag & Drop را فراهم می‌کند
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'application/pdf': [], 'application/zip': [] },
    maxFiles: 1,
    multiple: false,
  });

  // این تابع زمانی اجرا می‌شود که کاربر روی دکمه "آپلود" کلیک کند
  const handleUpload = async () => {
    if (!file) {
      toast.error('لطفاً ابتدا یک فایل را انتخاب کنید.');
      return;
    }
    setIsProcessing(true);
    const toastId = toast.loading('در حال آپلود فایل...');

    const formData = new FormData();
    formData.append('file', file, file.name); // فایل بهینه شده را ارسال می‌کنیم
    formData.append('title', title);
    formData.append('description', description);
    formData.append('usage_type', usageType);
    if (eventId) {
      formData.append('eventId', eventId);
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assets`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      toast.success('فایل با موفقیت آپلود شد!', { id: toastId });
      onUploadSuccess(data); // اطلاع‌رسانی به کامپوننت والد
      onClose(); // بستن مودال
    } catch (error) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg max-h-full overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">آپلود و بهینه‌سازی فایل</h2>

        {/* این بخش مربوط به UI کتابخانه Dropzone است */}
        <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}>
          <input {...getInputProps()} />
          {filePreview ? (
             <div className="relative">
                <img src={filePreview} alt="Preview" className="max-h-40 mx-auto rounded" onLoad={() => URL.revokeObjectURL(filePreview)} />
                <p className="text-sm text-gray-600 mt-2 break-all">{file.name}</p>
             </div>
          ) : (
            <p>فایل خود را اینجا بکشید و رها کنید، یا برای انتخاب کلیک کنید</p>
          )}
        </div>

        {/* فرم ورود اطلاعات تکمیلی فایل */}
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">عنوان فایل</label>
            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">توضیحات (اختیاری)</label>
            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows="2" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
          </div>
          <div>
            <label htmlFor="usageType" className="block text-sm font-medium text-gray-700">نوع کاربری فایل</label>
            <select id="usageType" value={usageType} onChange={e => setUsageType(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
              <option value="gallery_image">تصویر گالری</option>
              <option value="event_poster">پوستر رویداد</option>
              <option value="downloadable_file">فایل قابل دانلود</option>
              <option value="sponsor_logo">لوگوی حامی</option>
              <option value="uncategorized">دسته‌بندی نشده</option>
            </select>
          </div>
        </div>

        {/* دکمه‌های عملیاتی */}
        <div className="mt-6 flex justify-end space-x-3 rtl:space-x-reverse">
          <button onClick={onClose} disabled={isProcessing} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 disabled:opacity-50">
            انصراف
          </button>
          <button onClick={handleUpload} disabled={isProcessing || !file} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
            {isProcessing ? 'در حال پردازش...' : 'آپلود و ذخیره'}
          </button>
        </div>
      </div>
    </div>
  );
}