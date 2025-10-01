import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import EventManagementLayout from '../../../../components/layout/EventManagementLayout';
import useAuth from '../../../../hooks/useAuth';
import api from '../../../../lib/api';
import toast from 'react-hot-toast';

export default function EventMessagesPage() {
    const router = useRouter();
    const { slug } = router.query;
    const { isAuthenticated } = useAuth();

    const [event, setEvent] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!slug || !isAuthenticated) return;
            setLoading(true);
            try {
                // Assuming you have an API endpoint to get messages by event slug
                const [eventRes, messagesRes] = await Promise.all([
                    api.get(`/events/${slug}`),
                    api.get(`/messages?eventSlug=${slug}`)
                ]);
                setEvent(eventRes.data);
                setMessages(messagesRes.data);
            } catch (error) {
                toast.error('Failed to fetch message data.');
                console.error("Fetch data error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug, isAuthenticated]);

    const handleMarkAsRead = async (messageId, currentStatus) => {
        const toastId = toast.loading('Updating message status...');
        try {
            await api.put(`/messages/${messageId}`, { is_read: !currentStatus });
            // Refresh the list to show the change
            setMessages(prev => prev.map(msg => 
                msg.id === messageId ? { ...msg, is_read: !currentStatus } : msg
            ));
            toast.success('Message status updated.', { id: toastId });
        } catch (error) {
             toast.error('Failed to update message status.', { id: toastId });
        }
    };
    
    if (loading) {
        return (
            <EventManagementLayout eventName="Loading...">
                <p>Loading message list...</p>
            </EventManagementLayout>
        );
    }

    return (
        <EventManagementLayout eventName={event?.name}>
            <div dir="rtl">
                <div className="sm:flex sm:items-center mb-6">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl font-semibold leading-6 text-gray-900">Message Management</h1>
                        <p className="mt-2 text-sm text-gray-700">A list of all contact messages submitted for this event.</p>
                    </div>
                </div>

                <div className="flow-root mt-8">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                             <ul role="list" className="divide-y divide-gray-100">
                                {messages.length > 0 ? (
                                    messages.map((message) => (
                                        <li key={message.id} className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6">
                                            <div className="flex min-w-0 gap-x-4">
                                                <div className="min-w-0 flex-auto">
                                                    <p className="text-sm font-semibold leading-6 text-gray-900">
                                                        <span className="absolute inset-x-0 -top-px bottom-0" />
                                                        {message.full_name}
                                                    </p>
                                                    <p className="mt-1 flex text-xs leading-5 text-gray-500">{message.email}</p>
                                                    <p className="mt-2 text-sm leading-6 text-gray-700">{message.message}</p>
                                                </div>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-x-4">
                                                <div className="flex flex-col items-end">
                                                    <p className="text-sm leading-6 text-gray-900">{message.is_read ? "Read" : "Unread"}</p>
                                                    <p className="mt-1 text-xs leading-5 text-gray-500">
                                                        <time dateTime={message.created_at}>
                                                            {new Date(message.created_at).toLocaleDateString('en-US')}
                                                        </time>
                                                    </p>
                                                </div>
                                                <button onClick={() => handleMarkAsRead(message.id, message.is_read)} className="text-sm text-indigo-600 hover:text-indigo-900">
                                                    Toggle Read
                                                </button>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-center py-10 text-gray-500">No messages found for this event.</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </EventManagementLayout>
    );
}