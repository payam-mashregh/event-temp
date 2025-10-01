// frontend/components/EventSwiper.js
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import EventCard from './EventCard';

export default function EventSwiper({ events }) {
  if (!events || events.length === 0) {
    return (
        <div className="text-center bg-white p-10 rounded-xl shadow-md border">
            <p>هیچ رویداد پیش رویی یافت نشد.</p>
        </div>
    );
  }

  // فقط زمانی loop را فعال کن که تعداد اسلایدها کافی باشد
  const isLoopEnabled = events.length > 2;

  return (
    <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
            delay: 4000,
            disableOnInteraction: false,
        }}
        loop={isLoopEnabled}
        breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
        }}
        className="pb-16"
    >
        {events.map((event) => (
            <SwiperSlide key={event.id} className="h-auto pb-4">
                <EventCard event={event} />
            </SwiperSlide>
        ))}
    </Swiper>
  );
}