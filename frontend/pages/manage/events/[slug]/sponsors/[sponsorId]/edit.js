// upto/frontend/pages/manage/events/[slug]/sponsors/[sponsorId]/edit.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ManagementLayout from '../../../../../../components/layout/ManagementLayout';
import { useAuth } from '../../../../../../hooks/useAuth';
import toast from 'react-hot-toast';

export default function EditSponsorPage() {
    const [event, setEvent] = useState(null);
    const [formData, setFormData] = useState({ name: '', sponsorship_level: '', website_url: '' });
    const [logoFile, setLogoFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const router = useRouter();
    const { slug, sponsorId } = router.query;
    const { token } = useAuth();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            if (!slug || !sponsorId || !token) return;
            
            const eventRes = await fetch(`${apiUrl}/events/slug/${slug}`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (eventRes.ok) setEvent(await eventRes.json());
            
            const sponsorRes = await fetch(`${apiUrl}/sponsors/${sponsorId}`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (sponsorRes.ok) setFormData(await sponsorRes.json());
        };
        fetchData();
    }, [slug, sponsorId, token, apiUrl]);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const submissionData = new FormData();
        Object.keys(formData).forEach(key => submissionData.append(key, formData[key]));
        if (logoFile) submissionData.append('logo', logoFile);

        try {
            const res = await fetch(`${apiUrl}/sponsors/${sponsorId}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },
                body: submissionData
            });
            if (!res.ok) throw new Error((await res.json()).message || 'خطا در ویرایش حامی مالی');
            toast.success('حامی مالی با موفقیت ویرایش شد.');
            router.push(`/manage/events/${slug}/sponsors`);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (!formData.name) return <ManagementLayout pageTitle="در حال بارگذاری..."><p>در حال بارگذاری اطلاعات...</p></ManagementLayout>;

    return (
        <ManagementLayout pageTitle={event ? `ویرایش حامی: ${event.name}` : 'ویرایش حامی'} event={event}>
            <Head><title>ویرایش حامی مالی</title></Head>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium">نام حامی</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md" />
                </div>
                <div>
                    <label htmlFor="sponsorship_level" className="block text-sm font-medium">سطح حمایتی</label>
                    <input type="text" name="sponsorship_level" id="sponsorship_level" value={formData.sponsorship_level} onChange={handleChange} className="mt-1 block w-full rounded-md" />
                </div>
                <div>
                    <label htmlFor="website_url" className="block text-sm font-medium">وب‌سایت</label>
                    <input type="url" name="website_url" id="website_url" value={formData.website_url} onChange={handleChange} className="mt-1 block w-full rounded-md text-left" dir="ltr" />
                </div>
                <div>
                    <label className="block text-sm font-medium">تغییر لوگو (اختیاری)</label>
                    <input type="file" onChange={(e) => setLogoFile(e.target.files[0])} accept="image/*" className="mt-1 block w-full text-sm"/>
                </div>
                <div className="flex justify-end pt-4 border-t">
                    <button type="submit" disabled={isSubmitting} className="btn-primary">
                        {isSubmitting ? 'در حال ذخیره‌سازی...' : 'ذخیره تغییرات'}
                    </button>
                </div>
            </form>
        </ManagementLayout>
    );
}