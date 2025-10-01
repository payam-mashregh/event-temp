// upto/frontend/pages/events/[slug]/register.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../../components/layout/Layout';
import toast from 'react-hot-toast';

export default function RegisterPage() {
    const [event, setEvent] = useState(null);
    const [formFields, setFormFields] = useState([]);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const router = useRouter();
    const { slug } = router.query;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            if (!slug) return;
            setLoading(true);
            setError('');
            try {
                // Fetch both event details and its registration form
                const eventRes = await fetch(`${apiUrl}/events/slug/${slug}`);
                if (!eventRes.ok) throw new Error("رویداد یافت نشد");
                const eventData = await eventRes.json();
                setEvent(eventData);

                const formRes = await fetch(`${apiUrl}/forms/event/${slug}`);
                if (!formRes.ok) throw new Error("فرم ثبت نام برای این رویداد یافت نشد.");
                const formData = await formRes.json();
                setFormFields(formData.fields || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug, apiUrl]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch(`${apiUrl}/registrations/submit/${slug}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message);
            toast.success(result.message);
            router.push(`/events/${slug}`);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (loading) return <Layout><div className="text-center p-12">در حال بارگذاری فرم ثبت نام...</div></Layout>;
    if (error) return <Layout><div className="text-center p-12 text-red-600">{error}</div></Layout>;

    return (
        <Layout>
            <Head><title>ثبت نام در رویداد: {event?.name}</title></Head>
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold text-center mb-2">{event?.name}</h1>
                    <p className="text-center text-gray-600 mb-8">فرم ثبت نام</p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {formFields.map(field => (
                             <div key={field.id}>
                                <label htmlFor={field.label} className="block text-sm font-medium text-gray-700">{field.label}{field.is_required && ' *'}</label>
                                <input 
                                    type={field.field_type} 
                                    name={field.label}
                                    id={field.label}
                                    onChange={handleChange}
                                    required={field.is_required}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                />
                            </div>
                        ))}
                         <div className="pt-4 border-t">
                            <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
                                {isSubmitting ? 'در حال ثبت نام...' : 'ثبت نام نهایی'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </Layout>
    );
}