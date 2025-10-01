// upto/frontend/pages/manage/users.js
import { useState, useEffect, Fragment } from 'react';
import ManagementLayout from '../../components/layout/ManagementLayout';
import useAuth from '../../hooks/useAuth';
import api from '../../lib/api';
import { Switch, Dialog, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

const UserFormModal = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState({ fullName: user?.full_name || '', username: user?.username || '', password: '', role: user?.role || 'event_manager' });
    const [isLoading, setIsLoading] = useState(false);
    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const dataToSave = { fullName: formData.fullName, username: formData.username, role: formData.role };
        if (formData.password) dataToSave.password = formData.password;
        await onSave(dataToSave);
        setIsLoading(false);
    };

    return (
        <Transition appear show={true} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose} dir="rtl"><Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-black bg-opacity-25" /></Transition.Child><div className="fixed inset-0 overflow-y-auto"><div className="flex min-h-full items-center justify-center p-4 text-center"><Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"><Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-right align-middle shadow-xl transition-all"><Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900">{user ? `ویرایش کاربر: ${user.full_name}` : 'افزودن کاربر جدید'}</Dialog.Title><form onSubmit={handleSubmit} className="mt-4 space-y-4"><div><label htmlFor="fullName" className="block text-sm font-medium text-gray-700">نام کامل</label><input type="text" name="fullName" id="fullName" value={formData.fullName} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" /></div><div><label htmlFor="username" className="block text-sm font-medium text-gray-700">نام کاربری</label><input type="text" name="username" id="username" value={formData.username} onChange={handleChange} required disabled={!!user} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100" /></div><div><label htmlFor="password" className="block text-sm font-medium text-gray-700">رمز عبور</label><input type="password" name="password" id="password" value={formData.password} onChange={handleChange} placeholder={user ? 'برای تغییر، وارد کنید' : 'الزامی'} required={!user} autoComplete="new-password" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" /></div><div><label htmlFor="role" className="block text-sm font-medium text-gray-700">نقش</label><select name="role" id="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"><option value="event_manager">مدیر رویداد</option><option value="admin">ادمین</option></select></div><div className="mt-6 flex justify-end space-x-3 rtl:space-x-reverse"><button type="button" onClick={onClose} className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300">انصراف</button><button type="submit" disabled={isLoading} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:bg-indigo-400">{isLoading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}</button></div></form></Dialog.Panel></Transition.Child></div></div></Dialog>
        </Transition>
    );
};

const AssignEventModal = ({ user, onClose, onAssign }) => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/events/titles');
                setEvents(response.data);
                if (response.data.length > 0) setSelectedEvent(response.data[0].id);
            } catch (error) {
                toast.error('خطا در دریافت لیست رویدادها.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedEvent) {
            toast.error('لطفاً یک رویداد را انتخاب کنید.');
            return;
        }
        await onAssign(user.id, selectedEvent);
    };

    return (
        <Transition appear show={true} as={Fragment}>
             <Dialog as="div" className="relative z-50" onClose={onClose} dir="rtl"><Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-black bg-opacity-25" /></Transition.Child><div className="fixed inset-0 overflow-y-auto"><div className="flex min-h-full items-center justify-center p-4 text-center"><Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"><Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-right align-middle shadow-xl transition-all"><Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900">تخصیص رویداد به {user.full_name}</Dialog.Title><form onSubmit={handleSubmit} className="mt-4"><>{isLoading ? <p>در حال بارگذاری رویدادها...</p> : events.length > 0 ? <select value={selectedEvent} onChange={e => setSelectedEvent(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">{events.map(event => (<option key={event.id} value={event.id}>{event.name}</option>))}</select> : <p className="text-sm text-gray-500">هیچ رویدادی برای تخصیص یافت نشد.</p>}</><div className="mt-6 flex justify-end space-x-3 rtl:space-x-reverse"><button type="button" onClick={onClose} className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300">انصراف</button><button type="submit" disabled={isLoading || events.length === 0} className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:bg-green-400">تخصیص</button></div></form></Dialog.Panel></Transition.Child></div></div></Dialog>
        </Transition>
    );
};

const UserDetailsRow = ({ user, onUnassign }) => {
    const [managedEvents, setManagedEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchManagedEvents = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/users/${user.id}/events`);
            setManagedEvents(response.data);
        } catch (error) {
            toast.error('خطا در دریافت رویدادهای کاربر.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchManagedEvents();
    }, [user.id]);

    const handleUnassign = async (eventId) => {
        await onUnassign(user.id, eventId);
        // Refresh the list after un-assigning
        fetchManagedEvents();
    };

    return (
        <tr className="bg-gray-50">
            <td colSpan="5" className="px-4 py-4 sm:px-6">
                <h4 className="font-semibold text-gray-800">رویدادهای تحت مدیریت:</h4>
                {isLoading ? <p className="text-sm text-gray-500 mt-2">در حال بارگذاری...</p> : (
                    managedEvents.length > 0 ? (
                        <ul className="mt-2 list-disc list-inside space-y-2">
                            {managedEvents.map(event => (
                                <li key={event.id} className="flex justify-between items-center text-sm">
                                    <span>{event.name}</span>
                                    <button onClick={() => handleUnassign(event.id)} className="text-xs text-red-500 hover:text-red-700 font-semibold">حذف تخصیص</button>
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-sm text-gray-500 mt-2">هیچ رویدادی به این کاربر تخصیص داده نشده است.</p>
                )}
            </td>
        </tr>
    );
};

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [assigningUser, setAssigningUser] = useState(null);
    const [expandedUserId, setExpandedUserId] = useState(null);
    const { isAuthenticated } = useAuth();

    const fetchUsers = async () => { if (!isAuthenticated) return; setLoading(true); try { const response = await api.get('/users'); setUsers(response.data); } catch (err) { toast.error('خطا در دریافت لیست کاربران.'); } finally { setLoading(false); } };
    useEffect(() => { fetchUsers(); }, [isAuthenticated]);

    const handleSaveUser = async (userData) => { const toastId = toast.loading(editingUser ? 'در حال به‌روزرسانی...' : 'در حال افزودن...'); try { if (editingUser) await api.put(`/users/${editingUser.id}`, userData); else await api.post('/users', userData); toast.success('عملیات با موفقیت انجام شد.', { id: toastId }); fetchUsers(); setIsModalOpen(false); setEditingUser(null); } catch (error) { toast.error(error.response?.data?.message || 'خطایی رخ داد.', { id: toastId }); } };
    const handleToggleStatus = async (user) => { const newStatus = !user.is_active; const toastId = toast.loading(newStatus ? 'در حال فعال‌سازی...' : 'در حال غیرفعال‌سازی...'); try { await api.put(`/users/${user.id}/status`, { isActive: newStatus }); toast.success('وضعیت کاربر با موفقیت تغییر کرد.', { id: toastId }); fetchUsers(); } catch (error) { toast.error('خطا در تغییر وضعیت کاربر.', { id: toastId }); } };
    const handleAssignEvent = async (userId, eventId) => { const toastId = toast.loading('در حال تخصیص رویداد...'); try { await api.post('/users/assign-event', { userId, eventId }); toast.success('رویداد با موفقیت تخصیص داده شد.', { id: toastId }); setAssigningUser(null); } catch (error) { toast.error(error.response?.data?.message || 'خطایی رخ داد.', { id: toastId }); } };
    const handleUnassignEvent = async (userId, eventId) => { if (!confirm('آیا از حذف تخصیص این رویداد مطمئن هستید؟')) return; const toastId = toast.loading('در حال حذف تخصیص...'); try { await api.delete(`/users/${userId}/events/${eventId}`); toast.success('تخصیص با موفقیت حذف شد.', { id: toastId }); } catch (error) { toast.error('خطا در حذف تخصیص.', { id: toastId }); } };

    return (
        <div dir="rtl">
            <div className="sm:flex sm:items-center mb-6"><div className="sm:flex-auto"><h1 className="text-2xl font-bold leading-6 text-gray-900">مدیریت کاربران</h1><p className="mt-2 text-sm text-gray-700">لیست تمام کاربران ثبت شده در سیستم.</p></div><div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none"><button onClick={() => { setEditingUser(null); setIsModalOpen(true); }} type="button" className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">افزودن کاربر جدید</button></div></div>
            {loading ? <p>در حال بارگذاری...</p> : (<div className="flow-root mt-8"><div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8"><div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"><table className="min-w-full divide-y divide-gray-300"><thead><tr><th scope="col" className="py-3.5 pl-4 pr-3 text-right text-sm font-semibold text-gray-900 sm:pl-0">نام کامل</th><th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">نام کاربری</th><th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">نقش</th><th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">وضعیت</th><th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0"><span className="sr-only">عملیات</span></th></tr></thead><tbody className="divide-y divide-gray-200 bg-white">{users.map((user) => (<Fragment key={user.id}><tr><td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0"><button onClick={() => setExpandedUserId(expandedUserId === user.id ? null : user.id)} className="flex items-center hover:text-indigo-600">{user.full_name}{expandedUserId === user.id ? <ChevronUpIcon className="h-4 w-4 mr-2"/> : <ChevronDownIcon className="h-4 w-4 mr-2"/>}</button></td><td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.username}</td><td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.role === 'admin' ? 'ادمین' : 'مدیر رویداد'}</td><td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"><Switch checked={user.is_active} onChange={() => handleToggleStatus(user)} className={`${user.is_active ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2`}><span className={`${user.is_active ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} /></Switch></td><td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-left text-sm font-medium sm:pr-0 space-x-4 rtl:space-x-reverse"><button onClick={() => setAssigningUser(user)} type="button" className="text-green-600 hover:text-green-900">تخصیص رویداد</button><button onClick={() => { setEditingUser(user); setIsModalOpen(true); }} type="button" className="text-indigo-600 hover:text-indigo-900">ویرایش</button></td></tr>{expandedUserId === user.id && (<UserDetailsRow user={user} onUnassign={handleUnassignEvent} />)}</Fragment>))}</tbody></table></div></div></div>)}
            {isModalOpen && <UserFormModal user={editingUser} onClose={() => setIsModalOpen(false)} onSave={handleSaveUser} />}
            {assigningUser && <AssignEventModal user={assigningUser} onClose={() => setAssigningUser(null)} onAssign={handleAssignEvent} />}
        </div>
    );
}

UsersPage.getLayout = function getLayout(page) {
    return <ManagementLayout>{page}</ManagementLayout>;
};