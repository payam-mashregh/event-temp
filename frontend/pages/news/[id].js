// frontend/pages/news/[id].js
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
// --- START: MODIFICATION ---
// The Layout import is no longer needed here as it's handled globally in _app.js
// import Layout from '../../components/layout/Layout';
// --- END: MODIFICATION ---

function NewsDetailPage({ newsItem }) {
    if (!newsItem) {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl font-bold">خبر یافت نشد</h1>
                <Link href="/" legacyBehavior>
                    <a className="text-primary hover:underline mt-4 inline-block">بازگشت به صفحه اصلی</a>
                </Link>
            </div>
        );
    }

    const backendUrl = process.env.NEXT_PUBLIC_API_URL.replace('/api', '');
    const imageUrl = newsItem.image_url ? `${backendUrl}${newsItem.image_url}` : '/images/Hero-2.jpg';
    
    const publishedDate = new Date(newsItem.published_at).toLocaleDateString('fa-IR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        // --- START: MODIFICATION ---
        // We use a React Fragment (<>) instead of the redundant <Layout> component.
        <>
            <Head>
                <title>{newsItem.title}</title>
                <meta name="description" content={newsItem.content.substring(0, 160)} />
            </Head>

            <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
                <article>
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">{newsItem.title}</h1>
                        <div className="text-sm text-gray-500">
                            <span>منتشر شده در تاریخ {publishedDate}</span>
                            <span className="mx-2">•</span>
                            <span>مربوط به رویداد: </span>
                            <Link href={`/events/${newsItem.event_slug}`} legacyBehavior>
                                <a className="text-primary hover:underline font-semibold">{newsItem.event_name}</a>
                            </Link>
                        </div>
                    </div>
                    
                    <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden mb-8 shadow-lg">
                         <Image
                            src={imageUrl}
                            alt={newsItem.title}
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>

                    <div 
                        className="prose prose-lg max-w-none" 
                        dangerouslySetInnerHTML={{ __html: newsItem.content }} 
                    />
                </article>
            </div>
        </>
        // --- END: MODIFICATION ---
    );
}

export async function getServerSideProps(context) {
    const { id } = context.params;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    let newsItem = null;

    try {
        const res = await fetch(`${apiUrl}/news/${id}`);
        
        if (res.ok) {
            newsItem = await res.json();
        }
    } catch (error) {
        console.error("News detail page fetch error:", error);
    }

    if (!newsItem) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            newsItem,
        },
    };
}

export default NewsDetailPage;