import { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/router';
import EventManagementLayout from '../../../../components/layout/EventManagementLayout';
import useAuth from '../../../../hooks/useAuth';
import api from '../../../../lib/api';
import toast from 'react-hot-toast';
import { Dialog, Transition } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/24/outline';

// Sponsor Form Modal Component
const SponsorFormModal = ({ eventId, sponsor, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: sponsor?.name || '',
        website_url: sponsor?.website_url || '',
        sponsorship_level: sponsor?.sponsorship_level || 'Gold',
    });
    const [logoFile, setLogoFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleFileChange = (e) => setLogoFile(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const toastId = toast.loading(sponsor ? 'Updating sponsor...' : 'Adding sponsor...');

        const submissionData = new FormData();
        submissionData.append('name', formData.name);
        submissionData.append('website_url', formData.website_url);
        submissionData.append('sponsorship_level', formData.sponsorship_level);
        submissionData.append('eventId', eventId);
        if (logoFile) {
            submissionData.append('logo', logoFile);
        }

        try {
            if (sponsor) {
                await api.put(`/sponsors/${sponsor.id}`, submissionData, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else {
                await api.post('/sponsors', submissionData, { headers: { 'Content-Type': 'multipart/form-data' } });
            }
            toast.success('Sponsor saved successfully!', { id: toastId });
            onSave();
            onClose();
        } catch (error) {
            toast.error('Failed to save sponsor.', { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Transition appear show={true} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose} dir="rtl">
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-black bg-opacity-25" /></Transition.Child>
                <div className="fixed inset-0 overflow-y-auto"><div className="flex min-h-full items-center justify-center p-4 text-center"><Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"><Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-right align-middle shadow-xl transition-all">
                    <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900">{sponsor ? 'Edit Sponsor' : 'Add New Sponsor'}</Dialog.Title>
                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                        <div><label htmlFor="name" className="block text-sm font-medium text-gray-700">Sponsor Name</label><input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/></div>
                        <div><label htmlFor="website_url" className="block text-sm font-medium text-gray-700">Website URL</label><input type="url" name="website_url" id="website_url" value={formData.website_url} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/></div>
                        <div><label htmlFor="sponsorship_level" className="block text-sm font-medium text-gray-700">Sponsorship Level</label><select name="sponsorship_level" id="sponsorship_level" value={formData.sponsorship_level} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"><option>Gold</option><option>Silver</option><option>Bronze</option></select></div>
                        <div><label htmlFor="logo" className="block text-sm font-medium text-gray-700">Logo</label><input type="file" name="logo" id="logo" onChange={handleFileChange} accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/></div>
                        <div className="mt-6 flex justify-end gap-x-4"><button type="button" onClick={onClose} className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">Cancel</button><button type="submit" disabled={isSubmitting} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:bg-indigo-400">{isSubmitting ? 'Saving...' : 'Save'}</button></div>
                    </form>
                </Dialog.Panel></Transition.Child></div></div>
            </Dialog>
        </Transition>
    );
};

export default function EventSponsorsPage() {
    const router = useRouter();
    const { slug } = router.query;
    const { isAuthenticated } = useAuth();

    const [event, setEvent] = useState(null);
    const [sponsors, setSponsors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSponsor, setEditingSponsor] = useState(null);

    const fetchData = async () => {
        if (!slug || !isAuthenticated) return;
        setLoading(true);
        try {
            const [eventRes, sponsorsRes] = await Promise.all([
                api.get(`/events/${slug}`),
                api.get(`/sponsors?eventSlug=${slug}`)
            ]);
            setEvent(eventRes.data);
            setSponsors(sponsorsRes.data);
        } catch (error) {
            toast.error('Failed to fetch sponsor data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [slug, isAuthenticated]);

    const handleDelete = async (sponsorId) => {
        if (!confirm('Are you sure you want to delete this sponsor?')) return;
        const toastId = toast.loading('Deleting sponsor...');
        try {
            await api.delete(`/sponsors/${sponsorId}`);
            toast.success('Sponsor deleted.', { id: toastId });
            fetchData();
        } catch (error) {
            toast.error('Failed to delete sponsor.', { id: toastId });
        }
    };

    const openModalToAdd = () => {
        setEditingSponsor(null);
        setIsModalOpen(true);
    };

    const openModalToEdit = (sponsor) => {
        setEditingSponsor(sponsor);
        setIsModalOpen(true);
    };

    if (loading) {
        return <EventManagementLayout eventName="Loading..."><p>Loading sponsors...</p></EventManagementLayout>;
    }

    return (
        <EventManagementLayout eventName={event?.name}>
            <div dir="rtl">
                <div className="sm:flex sm:items-center mb-6">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl font-semibold">Sponsor Management</h1>
                        <p className="mt-2 text-sm text-gray-700">Manage all sponsors for this event.</p>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <button onClick={openModalToAdd} type="button" className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white">
                            <PlusIcon className="-ml-0.5 h-5 w-5" />
                            Add New Sponsor
                        </button>
                    </div>
                </div>

                <ul role="list" className="divide-y divide-gray-100">
                    {sponsors.map((sponsor) => (
                        <li key={sponsor.id} className="flex justify-between items-center gap-x-6 py-5">
                            <div className="flex min-w-0 gap-x-4 items-center">
                                <img className="h-12 w-12 flex-none rounded-full bg-gray-50 object-contain" src={sponsor.logo_url} alt={sponsor.name} />
                                <div className="min-w-0 flex-auto">
                                    <p className="text-sm font-semibold leading-6 text-gray-900">{sponsor.name}</p>
                                    <a href={sponsor.website_url} target="_blank" rel="noopener noreferrer" className="mt-1 truncate text-xs leading-5 text-gray-500 hover:text-indigo-600">{sponsor.website_url}</a>
                                </div>
                            </div>
                            <div className="flex shrink-0 items-center gap-x-4">
                                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">{sponsor.sponsorship_level}</span>
                                <button onClick={() => openModalToEdit(sponsor)} className="text-sm font-semibold text-indigo-600 hover:text-indigo-900">Edit</button>
                                <button onClick={() => handleDelete(sponsor.id)} className="text-sm font-semibold text-red-600 hover:text-red-900">Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            
            {/* --- START: Critical Fix --- */}
            {/* Only render the modal if it's open AND the event data is available */}
            {isModalOpen && event && <SponsorFormModal eventId={event.id} sponsor={editingSponsor} onClose={() => setIsModalOpen(false)} onSave={fetchData} />}
            {/* --- END: Critical Fix --- */}
        </EventManagementLayout>
    );
}