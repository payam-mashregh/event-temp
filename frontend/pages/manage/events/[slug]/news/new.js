import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
// --- START: Path Fix ---
import EventManagementLayout from '../../../../../components/layout/EventManagementLayout';
import useAuth from '../../../../../hooks/useAuth';
import api from '../../../../../lib/api';
// --- END: Path Fix ---
import toast from 'react-hot-toast';
import RichTextEditor from '../../../../../components/ui/RichTextEditor';

export default function NewNewsItemPage() {
    const router = useRouter();
    const { slug } = router.query;
    const { isAuthenticated } = useAuth();

    const [event, setEvent] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            if (!slug || !isAuthenticated) return;
            setLoading(true);
            try {
                const response = await api.get(`/events/${slug}`);
                setEvent(response.data);
            } catch (error) {
                toast.error('Failed to load event data.');
                router.push('/manage/events');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [slug, isAuthenticated, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const toastId = toast.loading('Creating news item...');

        try {
            await api.post('/news', {
                title,
                content,
                eventId: event.id,
            });
            toast.success('News item created successfully!', { id: toastId });
            router.push(`/manage/events/${slug}/news`);
        } catch (error) {
            toast.error('Failed to create news item.', { id: toastId });
            console.error('Create error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <EventManagementLayout eventName="Loading...">
                <p>Loading news editor...</p>
            </EventManagementLayout>
        );
    }

    return (
        <EventManagementLayout eventName={event?.name}>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow" dir="rtl">
                <div>
                    <h2 className="text-xl font-bold">Create New News Item</h2>
                </div>
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                </div>
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                    <div className="mt-1">
                        <RichTextEditor value={content} onChange={setContent} />
                    </div>
                </div>
                <div className="flex justify-end gap-x-4">
                    <button type="button" onClick={() => router.back()} className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:bg-indigo-400"
                    >
                        {isSubmitting ? 'Creating...' : 'Create Item'}
                    </button>
                </div>
            </form>
        </EventManagementLayout>
    );
}