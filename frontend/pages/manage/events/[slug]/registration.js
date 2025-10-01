import Head from 'next/head';
import ManagementLayout from '../../../../components/layout/ManagementLayout';
import { verifyTokenAndGetUser } from '../../../../lib/auth';
import { useState } from 'react';
import { PlusCircleIcon, LinkIcon } from '@heroicons/react/24/solid';

function FormManagementDashboard({ event }) {
    const webhookUrl = `${process.env.NEXT_PUBLIC_API_URL.replace('/api', '')}/api/registrations/submit`;
    const [apiKeyCopied, setApiKeyCopied] = useState(false);
    
    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text);
        if (type === 'api_key') {
            setApiKeyCopied(true);
            setTimeout(() => setApiKeyCopied(false), 2000);
        }
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-md border flex flex-col items-center text-center">
                    <PlusCircleIcon className="w-16 h-16 text-primary" />
                    <h2 className="text-xl font-bold mt-4">فرم‌ساز داخلی</h2>
                    <p className="text-secondary mt-2 flex-grow">برای فرم‌های ثبت‌نام و نظرسنجی‌های ساده، از ابزار قدرتمند کشیدن و رها کردن ما استفاده کنید.</p>
                    {/* --- START: FIX --- */}
                    {/* این لینک اکنون در یک تب جدید باز می‌شود */}
                    <a 
                        href={`/manage/events/${event.slug}/forms/builder`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-6 bg-primary text-white font-bold px-6 py-2.5 rounded-lg w-full block"
                    >
                        باز کردن فرم‌ساز در پنجره جدید
                    </a>
                    {/* --- END: FIX --- */}
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border flex flex-col items-center text-center">
                    <LinkIcon className="w-16 h-16 text-success" />
                    <h2 className="text-xl font-bold mt-4">اتصال فرم خارجی</h2>
                    <p className="text-secondary mt-2 flex-grow">فرم‌های پیچیده را در پلتفرم دلخواه خود بسازید و از طریق Webhook به SANAEvents متصل کنید.</p>
                     <div className="mt-4 text-right w-full bg-light p-3 rounded-lg border">
                        <label className="text-xs font-bold">کلید API رویداد:</label>
                        <div className="flex items-center">
                           <input type="text" readOnly value={event.api_key} className="w-full bg-transparent border-0 focus:ring-0 text-left text-sm" style={{direction: 'ltr'}}/>
                           <button onClick={() => copyToClipboard(event.api_key, 'api_key')} className="text-xs font-semibold text-primary flex-shrink-0">
                               {apiKeyCopied ? 'کپی شد!' : 'کپی'}
                           </button>
                        </div>
                    </div>
                </div>
            </div>
             <div className="mt-8 bg-gray-800 text-white p-6 rounded-xl">
                 <h3 className="font-bold">راهنمای Webhook</h3>
                 <p className="text-sm text-gray-300 mt-2">برای اتصال فرم خارجی، اطلاعات را با متد `POST` به آدرس زیر ارسال کرده و کلید API بالا را در هدر `X-API-KEY` قرار دهید.</p>
                 <pre className="mt-2 bg-gray-900 p-2 rounded text-xs" style={{direction: 'ltr'}}>{webhookUrl}</pre>
            </div>
        </div>
    );
}

function ManageFormsPage({ user, event }) {
    return (
        <ManagementLayout user={user} event={event}>
            <Head><title>مدیریت فرم‌ها: {event.name}</title></Head>
            <div className="border-b pb-4 mb-8">
                <h1 className="text-3xl font-extrabold text-dark">مدیریت فرم‌ها</h1>
                <p className="text-secondary mt-1">فرم‌های داخلی بسازید یا فرم‌های خارجی را متصل کنید.</p>
            </div>
            <FormManagementDashboard event={event} />
        </ManagementLayout>
    );
}

export async function getServerSideProps(context) {
    const user = verifyTokenAndGetUser(context.req);
    if (!user) return { redirect: { destination: '/login', permanent: false } };
    const { slug } = context.params;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
        const eventRes = await fetch(`${apiUrl}/events`);
        const allEvents = await eventRes.json();
        const event = allEvents.find(e => e.slug === slug);
        if (!event) return { notFound: true };
        return { props: { user, event } };
    } catch (error) {
        return { notFound: true };
    }
}

export default ManageFormsPage;