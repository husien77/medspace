import { redirect } from 'next/navigation';
import { getSessionUser, isAuthorizedRole } from '@/lib/auth';

export default async function DashboardPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  if (!isAuthorizedRole(user, ['SUPER_ADMIN', 'STUDENT'])) {
    redirect('/login');
  }

  const cards = [
    { label: 'المواد الحالية', value: '8', detail: '2 نشطة الآن' },
    { label: 'المحاضرات المكتملة', value: '74%', detail: 'آخر 30 يوم' },
    { label: 'الاختبارات', value: '5', detail: 'متاحة ومجدولة' },
    { label: 'الإشعارات', value: '12', detail: '3 غير مقروءة' },
  ];

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">مرحباً بعودتك</p>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">{user.fullName}</h1>
        </div>
        <a href="/api/auth/logout" className="btn-secondary">تسجيل الخروج</a>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="card-surface rounded-2xl p-5">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-3 text-3xl font-black text-slate-900 dark:text-white">{card.value}</p>
            <p className="mt-2 text-sm text-slate-500">{card.detail}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="card-surface rounded-[28px] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">أحدث المحاضرات</h2>
            <a href="/subjects" className="text-sm font-bold text-medspace-700 dark:text-medspace-300">عرض الكل</a>
          </div>
          <div className="space-y-3">
            {['الفسيولوجيا', 'التشريح', 'العلوم السريرية'].map((lecture) => (
              <div key={lecture} className="flex items-center justify-between rounded-2xl border border-slate-200 p-3 dark:border-slate-700">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{lecture}</p>
                  <p className="text-sm text-slate-500">اليوم · 08:30 صباحاً</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">مكتمل</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card-surface rounded-[28px] p-5">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">الإشعارات</h2>
          <div className="mt-4 space-y-3">
            {['تم رفع ملف PDF جديد', 'تحديث موعد محاضرة', 'إعلان جديد في علم الأمراض'].map((item) => (
              <div key={item} className="rounded-2xl bg-slate-100 p-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">{item}</div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
