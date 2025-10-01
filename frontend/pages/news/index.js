// frontend/pages/news/index.js
import Head from 'next/head';
import NewsCard from '../../components/NewsCard';

export default function NewsArchivePage({ allNews }) {
    return (
        <>
            <Head>
                <title>آرشیو اخبار</title>
                <meta name="description" content="آخرین اخبار و اطلاعیه‌های مربوط به رویدادها" />
            </Head>
            <div className="bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold text-gray-900">آرشیو اخبار</h1>
                        <p className="mt-4 text-lg text-gray-600">
                            آخرین اخبار و اطلاعیه‌های مربوط به رویدادهای برگزار شده را دنبال کنید.
                        </p>
                    </div>

                    {allNews.length > 0 ? (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {allNews.map(newsItem => (
                                <NewsCard key={newsItem.id} news={newsItem} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 text-lg">در حال حاضر هیچ خبری برای نمایش وجود ندارد.</p>
                    )}
                </div>
            </div>
        </>
    );
}

export async function getServerSideProps() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    let allNews = [];
    try {
        const res = await fetch(`${apiUrl}/news`);
        if (res.ok) {
            allNews = await res.json();
        }
    } catch (error) {
        console.error("Failed to fetch all news:", error);
    }

    return {
        props: {
            allNews,
        },
    };
}