// upto/frontend/components/HeroSection.js
import Link from 'next/link';

export default function HeroSection({ heroData, ctaLink, ctaText }) {
    // استفاده از تصویر پیش‌فرض در صورتی که تصویری برای رویداد مشخص نشده باشد
    const imageUrl = heroData?.imageUrl ? `${process.env.NEXT_PUBLIC_API_URL.replace('/api', '')}${heroData.imageUrl}` : '/images/Hero-2.jpg';

    return (
        <div className="relative bg-gray-900">
            <div className="absolute inset-0">
                <img
                    className="h-full w-full object-cover"
                    src={imageUrl}
                    alt={heroData?.title || 'Hero Image'}
                />
                <div className="absolute inset-0 bg-gray-900 opacity-60" />
            </div>
            <div className="relative mx-auto max-w-7xl py-24 px-4 sm:py-32 sm:px-6 lg:px-8 text-center">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                    {heroData?.title || 'عنوان رویداد'}
                </h1>
                <p className="mt-6 max-w-3xl mx-auto text-xl text-indigo-100">
                    {heroData?.subtitle || 'توضیحات تکمیلی رویداد'}
                </p>
                {/* **دکمه ثبت نام در اینجا اضافه می‌شود** */}
                {ctaLink && ctaText && (
                    <div className="mt-10">
                        <Link href={ctaLink} legacyBehavior>
                            <a className="inline-block rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700">
                                {ctaText}
                            </a>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}