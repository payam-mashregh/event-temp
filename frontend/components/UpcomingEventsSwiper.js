// frontend/components/UpcomingEventsSwiper.js
import EventCard from './EventCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Link from 'next/link';

export default function UpcomingEventsSwiper({ events }) {
  if (!events || events.length === 0) {
    return null;
  }

  return (
    <div className="my-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-extrabold text-dark">رویدادهای پیش رو</h2>
        <Link href="/events" legacyBehavior>
          <a className="text-primary font-semibold hover:underline">مشاهده همه</a>
        </Link>
      </div>
      <Swiper
        modules={[Navigation]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
      >
        {events.map((event) => (
          <SwiperSlide key={event.id}>
            <EventCard event={event} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}