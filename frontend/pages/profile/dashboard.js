import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import cookie from 'cookie';
import Link from 'next/link';
// Layout دیگر در اینجا import نمی‌شود، چون _app.js آن را فراهم می‌کند

export default function ParticipantDashboard() {
    const [user, setUser] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const participantUser = localStorage.getItem('participant_user');
        const cookies = cookie.parse(document.cookie);
        const token = cookies.participant_token;

        if (!participantUser || !token) {
            router.push('/participant-login');
            return;
        }

        setUser(JSON.parse(participantUser));

        const fetchRegistrations = async () => {
            const res = await fetch(`${apiUrl}/registrations/my-registrations`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setRegistrations(await res.json());
            } else {
                logout();
            }
            setLoading(false);
        };

        fetchRegistrations();
    }, [router, apiUrl]);

    const logout = () => {
        localStorage.removeItem('participant_user');
        document.cookie = cookie.serialize('participant_token', '', {
            path: '/',
            expires: new Date(0),
        });
        router.push('/participant-login');
    };

    if (loading || !user) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-lg text-secondary">در حال بارگذاری اطلاعات...</p>
            </div>
        );
    }
    
    // کامپوننت Layout از اینجا حذف شد و محتوا مستقیما return می‌شود
    return (
        <>
            <Head><title>پنل کاربری | SANAEvents</title></Head>
            <div className="container mx-auto px-6 py-12">
                <div className="flex justify-between items-center border-b pb-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-dark">پنل کاربری شما</h1>
                        <p className="text-secondary mt-1">خوش آمدید، {user.full_name}!</p>
                    </div>
                    <button onClick={logout} className="text-sm font-semibold text-danger hover:underline">خروج از حساب</button>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md border">
                    <h2 className="text-xl font-bold text-dark mb-4">رویدادهای ثبت‌نام شده</h2>
                    {registrations.length === 0 ? (
                        <p className="text-secondary text-center py-10">شما هنوز در هیچ رویدادی ثبت‌نام نکرده‌اید.</p>
                    ) : (
                        <div className="space-y-4">
                            {registrations.map(reg => (
                                <div key={reg.event_slug} className="border rounded-lg p-4 flex justify-between items-center bg-light">
                                    <div>
                                        <h3 className="font-bold text-lg text-dark">{reg.event_name}</h3>
                                        <p className="text-xs text-secondary mt-1">
                                            تاریخ رویداد: {new Date(reg.event_start_date).toLocaleDateString('fa-IR')}
                                        </p>
                                    </div>
                                    <Link href={`/events/${reg.event_slug}`} className="text-sm font-semibold text-primary hover:underline">
                                        مشاهده جزئیات رویداد
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}