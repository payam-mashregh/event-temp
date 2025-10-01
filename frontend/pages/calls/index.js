// upto/frontend/pages/calls/index.js
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/layout/Layout'; // **راه حل کلیدی: استفاده از Layout صحیح**
import { CalendarDaysIcon } from '@heroicons/react/24/outline';

function CallsPage({ calls }) {
    return (
        <Layout>
            <Head>
                <title>فراخوان‌های فعال</title>
                <meta name="description" content="لیست آخرین فراخوان‌های فعال برای رویدادها" />
            </Head>

            <main className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-dark">فراخوان‌های فعال</h1>
                    <p className="mt-2 text-lg text-secondary">در رویدادهای پیش رو شرکت کرده و ایده‌های خود را به اشتراک بگذارید.</p>
                </div>

                {calls.length === 0 ? (
                    <div className="text-center text-gray-500 py-20 bg-gray-50 rounded-lg">
                        <CalendarDaysIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <p className="text-xl">در حال حاضر هیچ فراخوان فعالی وجود ندارد.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {calls.map((call) => (
                            <div key={call.id} className="bg-white p-6 rounded-lg shadow-md border hover:shadow-xl transition-shadow flex flex-col">
                                <p className="text-sm text-secondary mb-2">{call.event_name}</p>
                                <Link href={`/calls/${call.id}`} legacyBehavior>
                                    <a className="text-xl font-bold text-dark hover:text-primary transition-colors block mb-4 flex-grow">{call.title}</a>
                                </Link>
                                <div className="mt-auto pt-4 border-t border-gray-100">
                                    <div className="text-sm text-red-600 font-semibold">
                                        <span>مهلت ارسال: </span>
                                        <span>{new Date(call.deadline).toLocaleDateString('fa-IR')}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </Layout>
    );
}

export async function getServerSideProps() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    let calls = [];
    try {
        const res = await fetch(`${apiUrl}/timeline/upcoming`);
        if (res.ok) {
            calls = await res.json();
        }
    } catch (error) {
        console.error("Failed to fetch active calls:", error);
    }

    return {
        props: {
            calls,
        },
    };
}

export default CallsPage;