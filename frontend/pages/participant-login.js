// frontend/pages/participant-login.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import cookie from 'cookie';

export default function ParticipantLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${apiUrl}/participants/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'خطا در ورود.');

            // ذخیره توکن و اطلاعات کاربر در localStorage و کوکی
            localStorage.setItem('participant_user', JSON.stringify(data.participant));
            document.cookie = cookie.serialize('participant_token', data.token, {
                path: '/',
                maxAge: 60 * 60 * 24 * 7, // 7 days
            });

            router.push('/profile/dashboard'); // هدایت به داشبورد کاربری
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-light">
            <Head><title>ورود شرکت‌کنندگان | SANAEvents</title></Head>
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl border">
                <div className="text-center">
                    <Link href="/" className="text-3xl font-extrabold text-dark">SANA<span className="text-primary">Events</span></Link>
                    <h2 className="mt-4 text-xl font-bold text-dark">ورود به پنل کاربری</h2>
                    <p className="mt-2 text-sm text-secondary">ایمیل و رمز عبوری که با آن ثبت‌نام کرده‌اید را وارد کنید.</p>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">ایمیل</label>
                        <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">رمز عبور</label>
                        <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                    </div>
                    {error && <p className="text-sm text-center text-danger bg-red-100 p-3 rounded-lg">{error}</p>}
                    <div>
                        <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400">
                            {loading ? 'در حال بررسی...' : 'ورود به پنل'}
                        </button>
                    </div>
                </form>
                <p className="text-center text-sm text-secondary">
                    <Link href="/" className="font-medium text-primary hover:underline">&rarr; بازگشت به صفحه اصلی</Link>
                </p>
            </div>
        </div>
    );
}

ParticipantLoginPage.getLayout = page => page; // این صفحه Layout ندارد