// frontend/components/NewsCard.js
import Link from 'next/link';
import Image from 'next/image';

export default function NewsCard({ news }) {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL.replace('/api', '');
    
    if (!news) return null;

    const imageUrl = news.image_url ? `${backendUrl}${news.image_url}` : 'https://placehold.co/600x400/e2e8f0/e2e8f0';
    const publishedDate = new Date(news.published_at).toLocaleDateString('fa-IR', {
        day: 'numeric',
        month: 'long'
    });

    return (
        <Link href={`/news/${news.id}`} legacyBehavior>
            <a className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group h-full">
                {/* --- START: MODIFICATION --- */}
                {/* Increased height from h-48 to h-56 to make it taller */}
                <div className="relative h-56 w-full">
                {/* --- END: MODIFICATION --- */}
                    <Image
                        src={imageUrl}
                        alt={news.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
                        className="transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
                <div className="p-4">
                    <p className="text-sm text-gray-500 mb-2">{publishedDate} - {news.event_name}</p>
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-primary transition-colors">{news.title}</h3>
                </div>
            </a>
        </Link>
    );
}