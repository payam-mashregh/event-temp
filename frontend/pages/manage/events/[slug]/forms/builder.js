// upto/frontend/pages/manage/events/[slug]/forms/builder.js
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ManagementLayout from '../../../../../components/layout/ManagementLayout';
import { useAuth } from '../../../../../hooks/useAuth';
import toast from 'react-hot-toast';

// We need to load the Form.io builder script dynamically on the client-side
const FormBuilder = ({ formDefinition, onFormChange }) => {
    const builderContainer = useRef(null);
    const builderInstance = useRef(null);

    useEffect(() => {
        if (builderContainer.current && window.Formio) {
            if (builderInstance.current) {
                builderInstance.current.destroy();
            }
            window.Formio.builder(builderContainer.current, formDefinition, {
                language: 'fa'
            }).then(builder => {
                builderInstance.current = builder;
                builder.on('change', () => {
                    if (onFormChange) {
                        onFormChange(builder.schema);
                    }
                });
            });
        }
        return () => {
            if (builderInstance.current) {
                builderInstance.current.destroy();
            }
        };
    }, [formDefinition]); // Re-render if the initial form definition changes

    return <div ref={builderContainer}></div>;
};


export default function FormBuilderPage() {
    const [event, setEvent] = useState(null);
    const [formSchema, setFormSchema] = useState({ components: [] });
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const router = useRouter();
    const { slug } = router.query;
    const { token } = useAuth();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            if (!slug || !token) return;
            setLoading(true);
            try {
                // Fetch event details
                const eventRes = await fetch(`${apiUrl}/events/slug/${slug}`, { headers: { 'Authorization': `Bearer ${token}` } });
                if (!eventRes.ok) throw new Error("رویداد یافت نشد");
                setEvent(await eventRes.json());
                
                // Fetch existing form schema
                const formRes = await fetch(`${apiUrl}/forms/event/${slug}`, { headers: { 'Authorization': `Bearer ${token}` } });
                if (formRes.ok) {
                    const formData = await formRes.json();
                    if (formData.json_definition && formData.json_definition.components) {
                         setFormSchema(formData.json_definition);
                    }
                }
            } catch (err) {
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug, token, apiUrl]);
    
    const handleFormChange = (schema) => {
        setFormSchema(schema);
    };

    const handleSaveForm = async () => {
        setIsSubmitting(true);
        try {
            const res = await fetch(`${apiUrl}/forms/event/${slug}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    title: 'فرم ثبت نام', // You can add fields for these later
                    description: `فرم ثبت نام رویداد ${event.name}`,
                    json_definition: formSchema
                })
            });
            if (!res.ok) throw new Error('خطا در ذخیره‌سازی فرم');
            toast.success('فرم با موفقیت ذخیره شد.');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (loading) {
        return <ManagementLayout pageTitle="در حال بارگذاری..."><p>در حال بارگذاری فرم‌ساز...</p></ManagementLayout>;
    }

    return (
        <ManagementLayout pageTitle={event ? `فرم ثبت نام: ${event.name}`: 'فرم ثبت نام'} event={event}>
            <Head>
                <title>مدیریت فرم ثبت نام</title>
                {/* Load Form.io CSS and JS */}
                <link rel='stylesheet' href='https://cdn.form.io/formiojs/formio.full.min.css' />
                <script src='https://cdn.form.io/formiojs/formio.full.min.js'></script>
            </Head>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">طراحی فرم ثبت نام</h1>
                    <button onClick={handleSaveForm} disabled={isSubmitting} className="btn-primary">
                        {isSubmitting ? 'در حال ذخیره‌سازی...' : 'ذخیره فرم'}
                    </button>
                </div>
                <FormBuilder formDefinition={formSchema} onFormChange={handleFormChange} />
            </div>
        </ManagementLayout>
    );
}

// getServerSideProps به طور کامل حذف شد.