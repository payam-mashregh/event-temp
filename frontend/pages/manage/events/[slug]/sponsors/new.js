// upto/frontend/pages/manage/events/[slug]/sponsors/new.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ManagementLayout from '../../../../../components/layout/ManagementLayout';
import { useAuth } from '../../../../../hooks/useAuth';
import toast from 'react-hot-toast';

export default function NewSponsorPage() {
    const [event, setEvent] = useState(null);
    const [formData, setFormData] = useState({ name: '', sponsorship_level: '', website_url: '' });
    const [logoFile, setLogoFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const router = useRouter();
    const { slug } = router.query;
    const { token } = useAuth();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        if (!slug || !token) return;
        fetch(`${apiUrl}/events/slug/${slug}`, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => setEvent(data))
            .catch(() => toast.error('رویداد یافت نشد'));
    }, [slug, token, apiUrl]);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!event || !logoFile) return toast.error('لطفاً تمام فیلدها و لوگو را مشخص کنید.');
        
        setIsSubmitting(true);
        const submissionData = new FormData();
        submissionData.append('event_id', event.id);
        Object.keys(formData).forEach(key => submissionData.append(key, formData[key]));
        submissionData.append('logo', logoFile);

        try {
            const res = await fetch(`${apiUrl}/sponsors`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: submissionData
            });
            if (!res.ok) throw new Error((await res.json()).message || 'خطا در ایجاد حامی مالی');
            toast.success('حامی مالی با موفقیت ایجاد شد.');
            router.push(`/manage/events/${slug}/sponsors`);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ManagementLayout pageTitle={event ? `حامی جدید برای: ${event.name}` : 'حامی جدید'} event={event}>
            <Head><title>افزودن حامی مالی جدید</title></Head>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium">نام حامی</label>
                    <input type="text" name="name" id="name" onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300" />
                </div>
                <div>
                    <label htmlFor="sponsorship_level" className="block text-sm font-medium">سطح حمایتی</label>
                    <input type="text" name="sponsorship_level" id="sponsorship_level" onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300" />
                </div>
                <div>
                    <label htmlFor="website_url" className="block text-sm font-medium">وب‌سایت</label>
                    <input type="url" name="website_url" id="website_url" onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 text-left" dir="ltr" />
                </div>
                <div>
                    <label className="block text-sm font-medium">لوگو</label>
                    <input type="file" onChange={(e) => setLogoFile(e.target.files[0])} required accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0"/>
                </div>
                <div className="flex justify-end pt-4 border-t">
                    <button type="submit" disabled={isSubmitting} className="btn-primary">
                        {isSubmitting ? 'در حال ایجاد...' : 'ایجاد حامی مالی'}
                    </button>
                </div>
            </form>
        </ManagementLayout>
    );
}