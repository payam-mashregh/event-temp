// upto/frontend/components/EventTabs.js
import { Fragment } from 'react';
import { Tab } from '@headlessui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ArrowDownCircleIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import ContactForm from './ContactForm'; // وارد کردن کامپوننت فرم تماس

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const getAssetUrl = (path) => {
    if (!path) return '';
    const baseUrl = process.env.NEXT_PUBLIC_API_URL.replace('/api', '');
    return `${baseUrl}${path}`;
};

// --- کامپوننت‌های داخلی برای محتوای هر تب ---

const AboutTab = ({ content }) => (
    <div className="prose prose-lg max-w-none p-4 rtl" dangerouslySetInnerHTML={{ __html: content }} />
);

const TimelineTab = ({ timeline }) => (
    <div className="p-4 flow-root">
        <ul className="-mb-8">
            {timeline.map((item, itemIdx) => (
                <li key={item.id}>
                    <div className="relative pb-8">
                        {itemIdx !== timeline.length - 1 ? <span className="absolute right-4 top-4 -mr-px h-full w-0.5 bg-gray-200" aria-hidden="true" /> : null}
                        <div className="relative flex items-start space-x-3 rtl:space-x-reverse">
                            <div><span className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white"><CalendarDaysIcon className="h-5 w-5 text-white" /></span></div>
                            <div className="min-w-0 flex-1 pt-1.5">
                                <p className="text-sm font-medium text-gray-900">{item.title}</p>
                                <p className="mt-1 text-xs text-gray-500">{new Date(item.start_date).toLocaleDateString('fa-IR-u-nu-latn', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    </div>
);

const NewsTab = ({ news }) => (
    <div className="p-4 space-y-10">
        {news.map(item => (
            <div key={item.id} className="prose prose-lg max-w-none">
                <h3 className="text-2xl font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-500 !mt-1 !mb-2">{new Date(item.published_at).toLocaleDateString('fa-IR-u-nu-latn')}</p>
                <div dangerouslySetInnerHTML={{ __html: item.content }} />
            </div>
        ))}
    </div>
);

const GalleryTab = ({ gallery }) => (
    <div className="p-4">
        <Swiper navigation pagination={{ clickable: true }} modules={[Navigation, Pagination]} spaceBetween={20} slidesPerView={1} breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}>
            {gallery.map(image => (
                <SwiperSlide key={image.id}><img src={getAssetUrl(image.file_url)} alt={image.title || 'Gallery Image'} className="rounded-lg shadow-md object-cover w-full h-72" /></SwiperSlide>
            ))}
        </Swiper>
    </div>
);

const SponsorsTab = ({ sponsors }) => (
    <div className="p-4">
        <div className="mt-8 flow-root">
            <div className="-mt-4 -ml-8 flex flex-wrap justify-center items-center lg:-ml-4">
                {sponsors.map((sponsor) => (
                    <a key={sponsor.id} href={sponsor.website_url || '#'} target="_blank" rel="noopener noreferrer" className="mt-4 ml-8 flex flex-shrink-0 flex-grow justify-center lg:ml-4 lg:flex-grow-0 p-4">
                        <img className="h-24 object-contain" src={getAssetUrl(sponsor.logo_url)} alt={sponsor.name} title={sponsor.name} />
                    </a>
                ))}
            </div>
        </div>
    </div>
);

const DownloadsTab = ({ downloads }) => (
    <div className="p-4">
        <ul role="list" className="divide-y divide-gray-200">
            {downloads.map((file) => (
                <li key={file.id} className="flex items-center justify-between py-4">
                    <div className="min-w-0 flex-1 flex items-center">
                        <ArrowDownCircleIcon className="h-6 w-6 text-gray-500 ml-3 rtl:ml-0 rtl:mr-3" />
                        <div>
                            <p className="text-md font-medium text-gray-800">{file.title}</p>
                            {file.description && <p className="text-sm text-gray-500">{file.description}</p>}
                        </div>
                    </div>
                    <a href={getAssetUrl(file.file_url)} download className="ml-4 rtl:ml-0 rtl:mr-4 flex-shrink-0 rounded-md bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100">
                        دانلود
                    </a>
                </li>
            ))}
        </ul>
    </div>
);

const ContactTab = ({ event }) => {
    if (event.contact_content) {
        return <div className="prose prose-lg max-w-none p-4 rtl" dangerouslySetInnerHTML={{ __html: event.contact_content }} />;
    }
    return <ContactForm eventId={event.id} />;
};

const RegistrationTab = ({ form }) => (
    <div className="p-6 text-center">
        <h3 className="text-2xl font-bold mb-4">{form.title || 'فرم ثبت نام'}</h3>
        <p className="text-gray-600 mb-8">{form.description || 'برای شرکت در این رویداد، لطفاً فرم زیر را تکمیل نمایید.'}</p>
        <a href={form.external_url || '#'} target="_blank" rel="noopener noreferrer" className="inline-block rounded-md bg-green-600 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
            شروع ثبت نام
        </a>
    </div>
);

export default function EventTabs({ event }) {
  const tabs = [
    { name: 'درباره رویداد', content: <AboutTab content={event.about_content || event.description} />, show: !!(event.about_content || event.description) },
    { name: 'فراخوان', content: <TimelineTab timeline={event.timeline} />, show: event.timeline?.length > 0 },
    { name: 'اخبار', content: <NewsTab news={event.news} />, show: event.news?.length > 0 },
    { name: 'گالری تصاویر', content: <GalleryTab gallery={event.gallery} />, show: event.gallery?.length > 0 },
    { name: 'حامیان مالی', content: <SponsorsTab sponsors={event.sponsors} />, show: event.sponsors?.length > 0 },
    { name: 'فایل‌های دانلود', content: <DownloadsTab downloads={event.downloads} />, show: event.downloads?.length > 0 },
    { name: 'تماس با ما', content: <ContactTab event={event} />, show: true },
    { name: 'ثبت نام', content: <RegistrationTab form={event.registration_form} />, show: !!event.registration_form },
  ].filter(tab => tab.show);

  return (
    <div className="w-full">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rtl:space-x-reverse rounded-xl bg-indigo-900/20 p-1 overflow-x-auto">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 px-4 text-sm font-medium leading-5 whitespace-nowrap',
                  'ring-white/60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white text-indigo-700 shadow'
                    : 'text-indigo-100 hover:bg-white/[0.12] hover:text-white'
                )
              }
            >
              {tab.name}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {tabs.map((tab, idx) => (
            <Tab.Panel
              key={idx}
              className={classNames(
                'rounded-xl bg-white p-3',
                'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
              )}
            >
              {tab.content}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}