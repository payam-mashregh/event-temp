import { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/router';
import EventManagementLayout from '../../../../components/layout/EventManagementLayout';
import useAuth from '../../../../hooks/useAuth';
import api from '../../../../lib/api';
import toast from 'react-hot-toast';
import { Dialog, Transition } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/24/outline';

// Timeline Item Form Modal Component
const TimelineItemFormModal = ({ eventId, item, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: item?.title || '',
        description: item?.description || '',
        start_date: item?.start_date ? new Date(item.start_date).toISOString().slice(0, 16) : '',
        end_date: item?.end_date ? new Date(item.end_date).toISOString().slice(0, 16) : '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const toastId = toast.loading(item ? 'Updating item...' : 'Adding item...');
        
        const dataToSubmit = { ...formData, eventId };

        try {
            if (item) {
                await api.put(`/timeline/${item.id}`, dataToSubmit);
            } else {
                await api.post('/timeline', dataToSubmit);
            }
            toast.success('Timeline item saved!', { id: toastId });
            onSave();
            onClose();
        } catch (error) {
            toast.error('Failed to save timeline item.', { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Transition appear show={true} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose} dir="rtl">
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-black bg-opacity-25" /></Transition.Child>
                <div className="fixed inset-0 overflow-y-auto"><div className="flex min-h-full items-center justify-center p-4 text-center"><Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"><Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-right align-middle shadow-xl transition-all">
                    <Dialog.Title as="h3" className="text-lg font-bold">{item ? 'Edit Timeline Item' : 'Add New Timeline Item'}</Dialog.Title>
                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                        <div><label htmlFor="title">Title</label><input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full rounded-md"/></div>
                        <div><label htmlFor="description">Description</label><textarea name="description" id="description" value={formData.description} onChange={handleChange} rows="3" className="mt-1 block w-full rounded-md"></textarea></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label htmlFor="start_date">Start Date</label><input type="datetime-local" name="start_date" id="start_date" value={formData.start_date} onChange={handleChange} className="mt-1 block w-full rounded-md"/></div>
                            <div><label htmlFor="end_date">End Date</label><input type="datetime-local" name="end_date" id="end_date" value={formData.end_date} onChange={handleChange} className="mt-1 block w-full rounded-md"/></div>
                        </div>
                        <div className="mt-6 flex justify-end gap-x-4"><button type="button" onClick={onClose}>Cancel</button><button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save'}</button></div>
                    </form>
                </Dialog.Panel></Transition.Child></div></div>
            </Dialog>
        </Transition>
    );
};

export default function EventTimelinePage() {
    const router = useRouter();
    const { slug } = router.query;
    const { isAuthenticated } = useAuth();

    const [event, setEvent] = useState(null);
    const [timelineItems, setTimelineItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const fetchData = async () => {
        if (!slug || !isAuthenticated) return;
        setLoading(true);
        try {
            const [eventRes, timelineRes] = await Promise.all([
                api.get(`/events/${slug}`),
                api.get(`/timeline?eventSlug=${slug}`) // Assuming an endpoint to get timeline by slug
            ]);
            setEvent(eventRes.data);
            setTimelineItems(timelineRes.data);
        } catch (error) {
            toast.error('Failed to fetch timeline data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [slug, isAuthenticated]);

    const handleDelete = async (itemId) => {
        if (!confirm('Are you sure you want to delete this item?')) return;
        const toastId = toast.loading('Deleting item...');
        try {
            await api.delete(`/timeline/${itemId}`);
            toast.success('Item deleted.', { id: toastId });
            fetchData();
        } catch (error) {
            toast.error('Failed to delete item.', { id: toastId });
        }
    };

    const openModalToAdd = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const openModalToEdit = (item) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };
    
    if (loading) {
        return <EventManagementLayout eventName="Loading..."><p>Loading timeline...</p></EventManagementLayout>;
    }

    return (
        <EventManagementLayout eventName={event?.name}>
            <div dir="rtl">
                <div className="sm:flex sm:items-center mb-6">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl font-semibold">Timeline Management</h1>
                        <p className="mt-2 text-sm text-gray-700">Manage all timeline items for this event.</p>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <button onClick={openModalToAdd} type="button" className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white">
                            <PlusIcon className="-ml-0.5 h-5 w-5" />
                            Add New Item
                        </button>
                    </div>
                </div>

                <div className="flow-root mt-8">
                    <ul role="list" className="divide-y divide-gray-200">
                        {timelineItems.map((item) => (
                            <li key={item.id} className="py-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{item.title}</p>
                                        <p className="text-sm text-gray-500">{item.description}</p>
                                        <div className="text-xs text-gray-500 mt-1">
                                            <span>Starts: {new Date(item.start_date).toLocaleString('en-US')}</span>
                                            <span className="mx-2">|</span>
                                            <span>Ends: {new Date(item.end_date).toLocaleString('en-US')}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-x-4">
                                        <button onClick={() => openModalToEdit(item)} className="text-sm text-indigo-600">Edit</button>
                                        <button onClick={() => handleDelete(item.id)} className="text-sm text-red-600">Delete</button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            {isModalOpen && <TimelineItemFormModal eventId={event.id} item={editingItem} onClose={() => setIsModalOpen(false)} onSave={fetchData} />}
        </EventManagementLayout>
    );
}