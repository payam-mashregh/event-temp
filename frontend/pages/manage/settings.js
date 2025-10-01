import { useState, useEffect } from 'react';
import ManagementLayout from '../../components/layout/ManagementLayout';
import useAuth from '../../hooks/useAuth';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function SettingsPage({ initialSettings }) {
    const { user } = useAuth(); // Correctly imported
    const [settings, setSettings] = useState(initialSettings || []);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Update local state when the form inputs change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(currentSettings =>
            currentSettings.map(setting =>
                setting.setting_key === name ? { ...setting, setting_value: value } : setting
            )
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const toastId = toast.loading('Saving settings...');

        try {
            // The API should be designed to accept an array of settings
            await api.post('/settings', { settings });
            toast.success('Settings saved successfully!', { id: toastId });
        } catch (error) {
            toast.error('Failed to save settings.', { id: toastId });
            console.error('Save settings error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Render nothing if the user is not an admin
    if (!user || user.role !== 'admin') {
        return (
            <ManagementLayout>
                <p>You do not have permission to view this page.</p>
            </ManagementLayout>
        );
    }
    
    return (
        <ManagementLayout>
            <div dir="rtl">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-12">
                        <div className="border-b border-gray-900/10 pb-12">
                            <h1 className="text-xl font-semibold leading-7 text-gray-900">Site Settings</h1>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                Manage general settings for the entire platform.
                            </p>

                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                {settings.map((setting) => (
                                    <div key={setting.setting_key} className="sm:col-span-4">
                                        <label htmlFor={setting.setting_key} className="block text-sm font-medium leading-6 text-gray-900 capitalize">
                                            {setting.setting_key.replace(/_/g, ' ')}
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                name={setting.setting_key}
                                                id={setting.setting_key}
                                                value={setting.setting_value}
                                                onChange={handleChange}
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:bg-indigo-400"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </form>
            </div>
        </ManagementLayout>
    );
}

// Fetch initial settings on the server-side
export async function getServerSideProps(context) {
    try {
        // We need to pass the cookie from the client to the backend API
        const cookie = context.req.headers.cookie;
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings`, {
            headers: {
                cookie: cookie || '',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch settings');
        }

        const initialSettings = await response.json();
        return {
            props: { initialSettings },
        };
    } catch (error) {
        console.error("getServerSideProps Error:", error.message);
        // Return empty props on error to avoid breaking the page
        return {
            props: { initialSettings: [] },
        };
    }
}