// frontend/pages/calls/[id].js
import Head from 'next/head';
import Link from 'next/link';
import { CalendarIcon } from '@heroicons/react/24/solid';

function CallDetailPage({ callItem }) {
    if (!callItem) {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl font-bold">فراخوان یافت نشد</h1>
                <Link href="/" legacyBehavior>
                    <a className="text-primary hover:underline mt-4 inline-block">بازگشت به صفحه اصلی</a>
                </Link>
            </div>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'نامشخص';
        return new Date(dateString).toLocaleDateString('fa-IR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <>
            <Head>
                <title>{callItem.title}</title>
                <meta name="description" content={callItem.description?.substring(0, 160) || ''} />
            </Head>

            <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
                <article>
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">{callItem.title}</h1>
                        <div className="text-sm text-gray-500">
                            <span>مربوط به رویداد: </span>
                            <Link href={`/events/${callItem.event_slug}`} legacyBehavior>
                                <a className="text-primary hover:underline font-semibold">{callItem.event_name}</a>
                            </Link>
                        </div>
                    </div>
                    
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">جزئیات زمان‌بندی</h2>
                        <div className="flex items-center text-gray-600 mb-2">
                            <CalendarIcon className="w-5 h-5 ml-2 text-primary" />
                            <strong>تاریخ شروع:</strong>
                            <span className="mr-2">{formatDate(callItem.start_date)}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <CalendarIcon className="w-5 h-5 ml-2 text-primary" />
                            <strong>تاریخ پایان (مهلت):</strong>
                            <span className="mr-2">{formatDate(callItem.end_date)}</span>
                        </div>
                    </div>

                    <div 
                        className="prose prose-lg max-w-none" 
                        dangerouslySetInnerHTML={{ __html: callItem.description }} 
                    />
                </article>
            </div>
        </>
    );
}

export async function getServerSideProps(context) {
    const { id } = context.params;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    let callItem = null;

    try {
        const res = await fetch(`${apiUrl}/timeline/${id}`);
        
        if (res.ok) {
            callItem = await res.json();
        }
    } catch (error) {
        console.error("Call detail page fetch error:", error);
    }

    if (!callItem) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            callItem,
        },
    };
}

export default CallDetailPage;