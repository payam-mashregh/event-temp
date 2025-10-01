// frontend/pages/manage/account.js
import { useState } from 'react';
import Head from 'next/head';
import ManagementLayout from '../../components/layout/ManagementLayout';
import { verifyTokenAndGetUser } from '../../lib/auth';

function AccountPage({ user }) {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('رمز عبور جدید و تکرار آن یکسان نیستند.');
            return;
        }
        if (newPassword.length < 6) {
            setError('رمز عبور جدید باید حداقل ۶ کاراکتر باشد.');
            return;
        }

        setIsSubmitting(true);
        const token = user.token;
        const res = await fetch(`${apiUrl}/users/change-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ oldPassword, newPassword })
        });

        const data = await res.json();
        if (res.ok) {
            setSuccess('رمز عبور شما با موفقیت تغییر کرد.');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } else {
            setError(data.message || 'خطا در تغییر رمز عبور');
        }
        setIsSubmitting(false);
    };

    return (
        <ManagementLayout user={user}>
            <Head><title>مدیریت حساب</title></Head>
            
            <div className="border-b pb-4 mb-8">
                <h1 className="text-3xl font-extrabold text-dark">مدیریت حساب کاربری</h1>
                <p className="text-secondary mt-1">در این بخش می‌توانید رمز عبور خود را تغییر دهید.</p>
            </div>

            <div className="max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md border space-y-6">
                    <h2 className="text-xl font-bold text-dark">تغییر رمز عبور</h2>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">رمز عبور فعلی</label>
                        <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required className="mt-1 block w-full input-style" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">رمز عبور جدید</label>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="mt-1 block w-full input-style" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">تکرار رمز عبور جدید</label>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="mt-1 block w-full input-style" />
                    </div>

                    {error && <p className="text-sm text-center text-danger bg-red-100 p-3 rounded-lg">{error}</p>}
                    {success && <p className="text-sm text-center text-success bg-green-100 p-3 rounded-lg">{success}</p>}

                    <div className="border-t pt-5">
                        <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-hover transition-colors disabled:bg-gray-400">
                            {isSubmitting ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                        </button>
                    </div>
                </form>
            </div>
            <style jsx>{`.input-style { display: block; width: 100%; border-radius: 0.5rem; border: 1px solid #d1d5db; padding: 0.75rem; }`}</style>
        </ManagementLayout>
    );
}

export async function getServerSideProps(context) {
    const user = verifyTokenAndGetUser(context.req);
    if (!user) {
        return { redirect: { destination: '/login', permanent: false } };
    }
    return { props: { user } };
}

export default AccountPage;