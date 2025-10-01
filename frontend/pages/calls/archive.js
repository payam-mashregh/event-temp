// frontend/pages/calls/archive.js
import Head from 'next/head';
import Link from 'next/link';

function ArchivedCallRow({ call }) {
    const endDate = new Date(call.end_date).toLocaleDateString('fa-IR', {
        day: 'numeric', month: 'long', year: 'numeric'
    });
    return (
        <tr className="border-b hover:bg-gray-50">
            <td className="py-4 px-6 font-bold text-gray-800">{call.title}</td>
            <td className="py-4 px-6 text-gray-600">{call.event_name}</td>
            <td className="py-4 px-6 text-gray-500">{endDate}</td>
            <td className="py-4 px-6 text-center">
                <Link href={`/calls/${call.id}`} legacyBehavior>
                    <a className="text-primary hover:underline font-semibold">مشاهده</a>
                </Link>
            </td>
        </tr>
    );
}

export default function ArchivedCallsPage({ archivedCalls }) {
    return (
        <>
            <Head>
                <title>آرشیو فراخوان‌ها</title>
                <meta name="description" content="فهرست فراخوان‌های گذشته و منقضی شده." />
            </Head>
            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold text-gray-900">آرشیو فراخوان‌ها</h1>
                        <p className="mt-4 text-lg text-gray-600">
                            فهرست فراخوان‌های گذشته و منقضی شده.
                        </p>
                        <Link href="/calls" legacyBehavior>
                            <a className="text-primary hover:underline mt-2 inline-block">بازگشت به فراخوان‌های فعال</a>
                        </Link>
                    </div>

                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <table className="w-full text-sm text-right text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                                <tr>
                                    <th scope="col" className="py-3 px-6">عنوان فراخوان</th>
                                    <th scope="col" className="py-3 px-6">رویداد مرتبط</th>
                                    <th scope="col" className="py-3 px-6">تاریخ پایان</th>
                                    <th scope="col" className="py-3 px-6"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {archivedCalls.length > 0 ? (
                                    archivedCalls.map(call => <ArchivedCallRow key={call.id} call={call} />)
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-10 text-gray-500">
                                            هیچ فراخوان آرشیو شده‌ای یافت نشد.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export async function getServerSideProps() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    let archivedCalls = [];
    try {
        const res = await fetch(`${apiUrl}/timeline/archived`);
        if (res.ok) {
            archivedCalls = await res.json();
        }
    } catch (error) {
        console.error("Failed to fetch archived calls:", error);
    }

    return {
        props: {
            archivedCalls,
        },
    };
}