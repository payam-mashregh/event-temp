// upto/frontend/pages/login.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useAuth from '../hooks/useAuth';
import api from '../lib/api';

// کامپوننت آیکون برای دکمه تازه‌سازی
const RefreshIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0M6.812 6.812A8.25 8.25 0 0118.475 18.475M2.985 19.644L6.166 16.46" />
  </svg>
);


export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaUrl, setCaptchaUrl] = useState('');
  const [isCaptchaLoading, setIsCaptchaLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  // تابع برای دریافت تصویر کپچای جدید از سرور
  const refreshCaptcha = async () => {
    setIsCaptchaLoading(true);
    const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/captcha?t=${new Date().getTime()}`;
    setCaptchaUrl(url);
  };

  useEffect(() => {
    refreshCaptcha();
    if (!loading && isAuthenticated) {
      router.push('/manage/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/login', { username, password, captcha });
      login(response.data.token);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'خطایی رخ داده است.';
      setError(errorMessage);
      refreshCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isAuthenticated) {
    return null;
  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-gray-50" dir="rtl">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            ورود به پنل مدیریت
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                نام کاربری
              </label>
              <div className="mt-2">
                <input
                  id="username" name="username" type="text" autoComplete="username" required
                  value={username} onChange={(e) => setUsername(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  رمز عبور
                </label>
                <div className="text-sm">
                  {/* --- START: Link Fix --- */}
                  <Link href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    فراموشی رمز؟
                  </Link>
                  {/* --- END: Link Fix --- */}
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password" name="password" type="password" autoComplete="current-password" required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="captcha" className="block text-sm font-medium leading-6 text-gray-900">
                متن تصویر را وارد کنید
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                <div className="bg-gray-200 border rounded-md p-1 h-[48px] w-[150px] flex items-center justify-center">
                  {isCaptchaLoading && <div className="text-xs text-gray-500">درحال بارگذاری...</div>}
                  <img
                    src={captchaUrl} alt="Captcha" onClick={refreshCaptcha}
                    onLoad={() => setIsCaptchaLoading(false)} onError={() => setIsCaptchaLoading(false)}
                    className={`cursor-pointer ${isCaptchaLoading ? 'hidden' : 'block'}`}
                    title="برای تصویر جدید کلیک کنید"
                  />
                </div>
                <button type="button" onClick={refreshCaptcha} className="p-2.5 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" title="دریافت تصویر جدید">
                  <span className="sr-only">تصویر جدید</span>
                  <RefreshIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-2">
                <input
                  id="captcha" name="captcha" type="text" required autoComplete="off"
                  value={captcha} onChange={(e) => setCaptcha(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            
            {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md text-center">
                    {error}
                </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'در حال بررسی...' : 'ورود'}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            حساب کاربری ندارید؟{' '}
            {/* --- START: Link Fix --- */}
            <Link href="/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              ثبت نام کنید
            </Link>
            {/* --- END: Link Fix --- */}
          </p>
        </div>
      </div>
    </>
  );
}