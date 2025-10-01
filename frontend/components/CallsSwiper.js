// frontend/components/CallsSwiper.js
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import Link from 'next/link';

const CallCard = ({ call }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full group border border-gray-200 p-5 text-center">
        <p className="text-xs text-secondary">فراخوان رویداد: {call.event_name}</p>
        <h3 className="text-lg font-bold text-dark my-3 h-14 overflow-hidden">{call.title}</h3>
        <p className="text-sm font-bold text-danger mb-4">
            مهلت: {new Date(call.deadline).toLocaleDateString('fa-IR')}
        </p>
        <Link href={`/events/${call.event_slug}`} className="font-semibold text-primary text-sm">
            اطلاعات بیشتر و ثبت‌نام
        </Link>
    </div>
);

export default function CallsSwiper({ calls }) {
    if (!calls || calls.length === 0) return <p className="text-center text-secondary">در حال حاضر فراخوان فعالی وجود ندارد.</p>;

    return (
        <Swiper modules={[Navigation]} spaceBetween={30} slidesPerView={1} navigation breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}>
            {calls.map((call) => (
                <SwiperSlide key={call.id} className="h-auto pb-4">
                    <CallCard call={call} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}