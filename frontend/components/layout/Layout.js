// upto/frontend/components/layout/Layout.js
import { Fragment } from 'react';
import Link from 'next/link';
import { Popover, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'صفحه اصلی', href: '/' },
  { name: 'رویدادها', href: '/events' },
  { name: 'فراخوان‌ها', href: '/calls' },
  { name: 'اخبار', href: '/news' },
];

export default function Layout({ children }) {
  return (
    <div className="bg-white" dir="rtl">
      <header>
        <Popover className="relative bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 md:justify-start md:space-x-10 lg:px-8">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <Link href="/">
                <span className="sr-only">لوگوی شما</span>
                <img
                  className="h-8 w-auto sm:h-10"
                  src="/images/unnamed.png" // لطفاً آدرس لوگوی خود را اینجا قرار دهید
                  alt="لوگو"
                />
              </Link>
            </div>
            <div className="-my-2 -mr-2 md:hidden">
              <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                <span className="sr-only">باز کردن منو</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </Popover.Button>
            </div>
            <Popover.Group as="nav" className="hidden space-x-10 md:flex space-x-reverse">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href} className="text-base font-medium text-gray-500 hover:text-gray-900">
                  {item.name}
                </Link>
              ))}
            </Popover.Group>
            <div className="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
              <Link href="/login" className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900">
                ورود مدیران
              </Link>
              <Link href="/participant-login" className="ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700">
                ورود شرکت‌کنندگان
              </Link>
            </div>
          </div>

          <Transition
            as={Fragment}
            enter="duration-200 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="duration-100 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Popover.Panel focus className="absolute inset-x-0 top-0 z-30 origin-top-right transform p-2 transition md:hidden">
              <div className="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="px-5 pt-5 pb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <img className="h-8 w-auto" src="/images/unnamed.png" alt="لوگو" />
                    </div>
                    <div className="-mr-2">
                      <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </Popover.Button>
                    </div>
                  </div>
                  <div className="mt-6">
                    <nav className="grid grid-cols-1 gap-7">
                      {navigation.map((item) => (
                        <Link key={item.name} href={item.href} className="-m-3 flex items-center rounded-lg p-3 hover:bg-gray-50">
                          <span className="ml-4 text-base font-medium text-gray-900">{item.name}</span>
                        </Link>
                      ))}
                    </nav>
                  </div>
                </div>
                <div className="py-6 px-5">
                  <div className="mt-6">
                    <Link href="/participant-login" className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700">
                      ورود شرکت‌کنندگان
                    </Link>
                    <p className="mt-6 text-center text-base font-medium text-gray-500">
                      مدیر هستید؟{' '}
                      <Link href="/login" className="text-indigo-600 hover:text-indigo-500">
                        از اینجا وارد شوید
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </Popover>
      </header>
      <main>{children}</main>
      {/* می‌توانید فوتر را در اینجا اضافه کنید */}
    </div>
  );
}