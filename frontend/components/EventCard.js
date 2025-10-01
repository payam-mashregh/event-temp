// frontend/components/EventCard.js
import Link from 'next/link';
import { CalendarIcon, MapPinIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

const formatDate = (dateString) => {
  if (!dateString) return 'تاریخ نامشخص';
  return new Date(dateString).toLocaleDateString('fa-IR', {
    day: 'numeric',
    month: 'long',
  });
};

export default function EventCard({ event }) {
  const isExternal = event.event_type === 'external';
  const backendUrl = process.env.NEXT_PUBLIC_API_URL.replace('/api', '');
  const imageUrl = event.poster_url ? `${backendUrl}${event.poster_url}` : '/images/Hero-2.jpg';

  const CardContent = () => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full flex flex-col group border border-transparent hover:border-primary transition-all duration-300">
      {/* --- START: MODIFICATION --- */}
      {/* Increased height from h-52 to h-64 for a more prominent poster */}
      <div className="relative h-64 w-full overflow-hidden"> 
      {/* --- END: MODIFICATION --- */}
        <Image 
          src={imageUrl} 
          alt={`پوستر رویداد ${event.name}`} 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 right-4 text-white">
            <h3 className="text-xl font-extrabold">{event.name}</h3>
            <p className="text-sm opacity-90">{event.topic || 'رویداد تخصصی'}</p>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center text-secondary mb-3">
            <CalendarIcon className="w-5 h-5 ml-2 text-primary"/>
            <span className="font-semibold">{formatDate(event.start_date)}</span>
        </div>
        <div className="flex items-center text-secondary">
            <MapPinIcon className="w-5 h-5 ml-2 text-primary"/>
            <span className="font-semibold">{event.location || 'اعلام نشده'}</span>
        </div>
        <div className="mt-auto pt-4">
          <span className="text-base font-bold text-primary flex items-center justify-center w-full bg-primary/10 rounded-lg py-3 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
            {isExternal ? 'مشاهده سایت' : 'اطلاعات بیشتر'}
          </span>
        </div>
      </div>
    </div>
  );

  if (isExternal) {
    return (
      <a href={event.website_url} target="_blank" rel="noopener noreferrer" className="block h-full">
        <CardContent />
      </a>
    );
  }

  return (
    <Link href={`/events/${event.slug}`} legacyBehavior>
      <a className="block h-full">
        <CardContent />
      </a>
    </Link>
  );
}