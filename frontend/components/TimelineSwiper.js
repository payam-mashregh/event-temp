// upto/frontend/components/TimelineSwiper.js
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import Link from 'next/link';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';

export default function TimelineSwiper({ items }) {
    if (!items) {
        // در صورتی که داده‌ها null باشند، چیزی نمایش نمی‌دهیم تا از خطا جلوگیری شود
        return null;
    }

    return (
        <section className="py-12">
            <h2 className="text-3xl font-extrabold text-center text-dark mb-8">آخرین فراخوان‌ها</h2>
            {items.length === 0 ? (
                <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-lg">
                    <CalendarDaysIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                    <p>در حال حاضر هیچ فراخوان فعالی وجود ندارد.</p>
                </div>
            ) : (
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={30}
                    slidesPerView={1}
                    navigation
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    className="!pb-10"
                >
                    {items.map((item) => (
                        <SwiperSlide key={item.id} className="bg-white p-6 rounded-lg shadow-md border hover:shadow-xl transition-shadow">
                            <p className="text-sm text-secondary mb-2">{item.event_name}</p>
                            <Link href={`/calls/${item.id}`} legacyBehavior>
                                <a className="text-lg font-bold text-dark hover:text-primary transition-colors block mb-4">{item.title}</a>
                            </Link>
                            <div className="text-sm text-red-600 font-semibold">
                                <span>مهلت ارسال: </span>
                                <span>{new Date(item.deadline).toLocaleDateString('fa-IR')}</span>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </section>
    );
}