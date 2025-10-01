// upto/frontend/pages/events/[slug].js
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import EventTabs from '../../components/EventTabs';
import { CalendarDaysIcon, MapPinIcon } from '@heroicons/react/24/outline';

const getAssetUrl = (path) => {
    if (!path) return '';
    const baseUrl = process.env.NEXT_PUBLIC_API_URL.replace('/api', '');
    return `${baseUrl}${path}`;
};

export default function EventDetailPage({ event }) {
    const router = useRouter();
    if (router.isFallback) return <Layout><div>در حال بارگذاری...</div></Layout>;
    if (!event) return <Layout><div>رویداد یافت نشد.</div></Layout>;

    return (
        <Layout>
            <div className="bg-white" dir="rtl">
                {/* --- Hero Section --- */}
                <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
                    <img
                        src={getAssetUrl(event.poster_url) || "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2830&q=80"}
                        alt={event.name}
                        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-20"
                    />
                    <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
                        <div className="mx-auto max-w-2xl">
                            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">{event.name}</h1>
                            <p className="mt-6 text-lg leading-8 text-gray-300">{event.topic}</p>
                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                {event.registration_form && (
                                    <a href="#ثبت-نام" className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400">
                                        هم اکنون ثبت نام کنید
                                    </a>
                                )}
                                <a href="#درباره-رویداد" className="text-sm font-semibold leading-6 text-white">
                                    بیشتر بدانید <span aria-hidden="true">→</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Main Content with Tabs --- */}
                <div className="bg-gray-100">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                        <EventTabs event={event} />
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export async function getServerSideProps(context) {
    const { slug } = context.params;
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${slug}`);
        if (!res.ok) {
            return { notFound: true };
        }
        const event = await res.json();
        return {
            props: { event },
        };
    } catch (error) {
        console.error(`Failed to fetch event data for slug: ${slug}`, error);
        return { notFound: true };
    }
}