import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import EventManagementLayout from '../../../../components/layout/EventManagementLayout';
import useAuth from '../../../../hooks/useAuth';
import api from '../../../../lib/api';
import toast from 'react-hot-toast';

export default function EventParticipantsPage() {
    const router = useRouter();
    const { slug } = router.query;
    const { isAuthenticated } = useAuth();

    const [event, setEvent] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!slug || !isAuthenticated) return;
            setLoading(true);
            try {
                // Assuming you have an API endpoint to get participants by event slug
                const [eventRes, participantsRes] = await Promise.all([
                    api.get(`/events/${slug}`),
                    api.get(`/participants?eventSlug=${slug}`)
                ]);
                setEvent(eventRes.data);
                setParticipants(participantsRes.data);
            } catch (error) {
                toast.error('Failed to fetch participant data.');
                console.error("Fetch data error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug, isAuthenticated]);

    if (loading) {
        return (
            <EventManagementLayout eventName="Loading...">
                <p>Loading participant list...</p>
            </EventManagementLayout>
        );
    }

    return (
        <EventManagementLayout eventName={event?.name}>
            <div dir="rtl">
                <div className="sm:flex sm:items-center mb-6">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl font-semibold leading-6 text-gray-900">Participant Management</h1>
                        <p className="mt-2 text-sm text-gray-700">A list of all participants registered for this event.</p>
                    </div>
                </div>

                <div className="flow-root mt-8">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead>
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-right text-sm font-semibold text-gray-900 sm:pl-0">Full Name</th>
                                        <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Email</th>
                                        <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Registration Date</th>
                                        <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Verified</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {participants.length > 0 ? (
                                        participants.map((participant) => (
                                            <tr key={participant.id}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{participant.name}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{participant.email}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {new Date(participant.registration_date).toLocaleDateString('en-US')}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {participant.is_mobile_verified ? 'Yes' : 'No'}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center py-10 text-gray-500">
                                                No participants have registered yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </EventManagementLayout>
    );
}