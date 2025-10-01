import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import EventManagementLayout from '../../../../components/layout/EventManagementLayout';
import useAuth from '../../../../hooks/useAuth';
import api from '../../../../lib/api';
import toast from 'react-hot-toast';
import RichTextEditor from '../../../../components/ui/RichTextEditor'; // This now imports our dynamic component

export default function EventPagesEditor() {
    const router = useRouter();
    const { slug } = router.query;
    const { isAuthenticated } = useAuth();
    const [event, setEvent] = useState(null);
    const [aboutContent, setAboutContent] = useState('');
    const [contactContent, setContactContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!slug || !isAuthenticated) return;
            setLoading(true);
            try {
                const [eventRes, contentRes] = await Promise.all([
                    api.get(`/events/${slug}`),
                    api.get(`/events/${slug}/pages`)
                ]);

                setEvent(eventRes.data);
                setAboutContent(contentRes.data.about_content || '');
                setContactContent(contentRes.data.contact_content || '');

            } catch (error) {
                toast.error('Failed to fetch page content.');
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug, isAuthenticated]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const toastId = toast.loading('Saving page content...');
        
        try {
            await api.put(`/events/${slug}/pages`, {
                about_content: aboutContent,
                contact_content: contactContent,
            });
            toast.success('Content saved successfully!', { id: toastId });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save content.', { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <EventManagementLayout eventName="Loading...">
                <p>Loading page editor...</p>
            </EventManagementLayout>
        );
    }

    return (
        <EventManagementLayout eventName={event?.name}>
            <form onSubmit={handleSubmit} className="space-y-8" dir="rtl">
                <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Content for "About" Page</h3>
                    <div className="mt-2">
                        <RichTextEditor value={aboutContent} onChange={setAboutContent} />
                    </div>
                </div>

                <div className="pt-8">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Content for "Contact" Page</h3>
                    <div className="mt-2">
                        <RichTextEditor value={contactContent} onChange={setContactContent} />
                    </div>
                </div>

                <div className="flex justify-end pt-8">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:bg-indigo-400"
                    >
                        {isSubmitting ? 'Saving...' : 'Save All Changes'}
                    </button>
                </div>
            </form>
        </EventManagementLayout>
    );
}