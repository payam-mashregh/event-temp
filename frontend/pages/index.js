// upto/frontend/pages/index.js
import Head from 'next/head';
import Layout from '../components/layout/Layout'; // وارد کردن Layout اصلی
import HeroSection from '../components/HeroSection';
import UpcomingEventsSwiper from '../components/UpcomingEventsSwiper';
import NewsSwiper from '../components/NewsSwiper';
import TimelineSwiper from '../components/TimelineSwiper';

export default function HomePage({ upcomingEvents, latestNews, upcomingTimeline, heroSettings }) {
  return (
    // صفحه را در Layout قرار می‌دهیم
    <Layout>
      <Head>
        <title>{heroSettings?.hero_title || 'پلتفرم مدیریت رویداد'}</title>
        <meta name="description" content={heroSettings?.hero_subtitle || 'پلتفرم جامع مدیریت رویدادهای فناورانه'} />
      </Head>
      <HeroSection heroData={{
          title: heroSettings.hero_title,
          subtitle: heroSettings.hero_subtitle,
          imageUrl: heroSettings.hero_image_url
      }} />
      <main className="container mx-auto px-4 py-8">
        <UpcomingEventsSwiper events={upcomingEvents} />
        <NewsSwiper newsItems={latestNews} />
        <TimelineSwiper items={upcomingTimeline} />
      </main>
    </Layout>
  );
}

export async function getServerSideProps() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  let upcomingEvents = [];
  let latestNews = [];
  let upcomingTimeline = [];
  let heroSettings = {};

  try {
    const [eventsRes, newsRes, timelineRes, settingsRes] = await Promise.all([
      fetch(`${apiUrl}/events/upcoming`),
      fetch(`${apiUrl}/news/latest-per-event`),
      fetch(`${apiUrl}/timeline/upcoming`),
      fetch(`${apiUrl}/settings`) // اطمینان حاصل کنید که این API در بک‌اند وجود دارد
    ]);

    if (eventsRes.ok) upcomingEvents = await eventsRes.json();
    if (newsRes.ok) latestNews = await newsRes.json();
    if (timelineRes.ok) upcomingTimeline = await timelineRes.json();
    if (settingsRes.ok) {
        const settingsArray = await settingsRes.json();
        // تبدیل آرایه تنظیمات به یک آبجکت برای دسترسی آسان
        settingsArray.forEach(setting => {
            heroSettings[setting.setting_key] = setting.setting_value;
        });
    }

  } catch (error) {
    console.error('Home page data fetch error:', error);
    // در صورت بروز خطا، مقادیر پیش‌فرض را برمی‌گردانیم تا صفحه از کار نیفتد
  }

  return {
    props: {
      upcomingEvents,
      latestNews,
      upcomingTimeline,
      heroSettings,
    },
  };
}