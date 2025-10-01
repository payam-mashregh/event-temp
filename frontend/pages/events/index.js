// frontend/pages/events/index.js
import { useState } from 'react';
import Head from 'next/head';
import EventCard from '../../components/EventCard';

export default function AllEventsPage({ allEvents }) {
  const [filter, setFilter] = useState('upcoming'); // 'upcoming' or 'past'

  const now = new Date();

  const upcomingEvents = allEvents.filter(event => new Date(event.start_date) >= now);
  const pastEvents = allEvents.filter(event => new Date(event.start_date) < now);

  const eventsToShow = filter === 'upcoming' ? upcomingEvents : pastEvents;

  return (
    <>
      <Head>
        <title>همه رویدادها | SANAEvents</title>
      </Head>
      <div className="bg-white">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-dark">ویترین رویدادها</h1>
            <p className="text-lg text-secondary mt-4 max-w-2xl mx-auto">
              جدیدترین رویدادهای پیش رو را کاوش کرده و به آرشیو رویدادهای گذشته دسترسی داشته باشید.
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex justify-center items-center mb-12 border border-gray-200 rounded-lg p-1 max-w-sm mx-auto bg-gray-100">
            <button
              onClick={() => setFilter('upcoming')}
              className={`w-1/2 px-4 py-2.5 text-base font-bold rounded-md transition-colors ${
                filter === 'upcoming' ? 'bg-primary text-white shadow' : 'text-secondary hover:bg-gray-200'
              }`}
            >
              پیش رو ({upcomingEvents.length})
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`w-1/2 px-4 py-2.5 text-base font-bold rounded-md transition-colors ${
                filter === 'past' ? 'bg-primary text-white shadow' : 'text-secondary hover:bg-gray-200'
              }`}
            >
              آرشیو ({pastEvents.length})
            </button>
          </div>

          {/* Events Grid */}
          {eventsToShow.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {eventsToShow.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <p className="text-xl font-semibold text-secondary">
                در حال حاضر رویدادی در این دسته‌بندی وجود ندارد.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${apiUrl}/events`);
    const allEvents = res.ok ? await res.json() : [];
    
    // مرتب‌سازی رویدادها بر اساس تاریخ (جدیدترین اول)
    allEvents.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));

    return { props: { allEvents } };
  } catch (error) {
    console.error("Failed to fetch all events:", error);
    return { props: { allEvents: [] } };
  }
}