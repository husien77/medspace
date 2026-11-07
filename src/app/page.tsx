import { getSessionUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

const subjects = [
  { name: 'تشريح', progress: 78, icon: '🫀', color: 'bg-teal-500', lectures: 24, completed: 19 },
  { name: 'أحياء', progress: 66, icon: '🧬', color: 'bg-pink-500', lectures: 21, completed: 14 },
  { name: 'علوم صحية', progress: 84, icon: '🧪', color: 'bg-violet-500', lectures: 18, completed: 15 },
  { name: 'طب أسري', progress: 58, icon: '🩺', color: 'bg-amber-500', lectures: 27, completed: 16 },
];

const recentLectures = [
  { title: 'مجموعة عضلات الذراع', subject: 'تشريح', date: 'اليوم', status: 'مكتمل' },
  { title: 'المسالك الهوائية', subject: 'أحياء', date: 'الأمس', status: 'مكتمل' },
  { title: 'التخطيط السريري', subject: 'علوم صحية', date: '2 يوم', status: 'مستقبلي' },
];

export default async function HomePage() {
  const user = await getSessionUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <main className="min-h-screen bg-transparent px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-medspace-700 dark:text-medspace-300">Designed & Owned by</p>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">الحسين الغرسي</h1>
          </div>
          <nav className="flex items-center gap-3">
            <a href="/about" className="btn-secondary">عن المنصة</a>
            <a href="/login" className="btn-primary">تسجيل الدخول</a>
          </nav>
        </header>

        <section className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full border border-medspace-200 bg-medspace-50 px-3 py-1 text-sm font-medium text-medspace-700 dark:border-medspace-800 dark:bg-medspace-950/50 dark:text-medspace-300">
              منصة أكاديمية طبية خاصة
            </div>

            <h2 className="max-w-2xl text-5xl font-black leading-tight text-slate-900 dark:text-white">
              MEDSPACE <span className="text-medspace-600">نظام تعلّم</span> متكامل للطب البشري
            </h2>

            <p className="max-w-xl text-xl text-slate-600 dark:text-slate-300">
              بيئة تعليمية احترافية تجمع المواد الدراسية، المحاضرات، الملفات PDF، التقييمات، والإعلانات في واجهة عربية أولاً، جاهزة للطلاب وأعضاء الإدارة.
            </p>

            <div className="flex flex-wrap gap-4">
              <a href="/register" className="btn-primary">إنشاء حساب</a>
              <a href="/about" className="btn-secondary">استكشاف المنصة</a>
            </div>

            <div className="flex flex-wrap gap-6 pt-4 text-sm text-slate-600 dark:text-slate-300">
              <div><span className="font-black text-slate-900 dark:text-white">320+</span> طالب</div>
              <div><span className="font-black text-slate-900 dark:text-white">18</span> مادة</div>
              <div><span className="font-black text-slate-900 dark:text-white">96%</span> رضا</div>
            </div>
          </div>

          <div className="card-surface med-grid rounded-[28px] p-5">
            <div className="space-y-4 rounded-3xl bg-white p-5 shadow-soft dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">ملخص الأداء</span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">مُحدث</span>
              </div>

              {subjects.map((subject) => (
                <div key={subject.name} className="rounded-2xl border border-slate-200 p-3 dark:border-slate-700">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${subject.color} text-lg`}>{subject.icon}</div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-100">{subject.name}</p>
                        <p className="text-xs text-slate-500">{subject.completed}/{subject.lectures} محاضرات مكتملة</p>
                      </div>
                    </div>
                    <span className="font-black text-medspace-700 dark:text-medspace-300">{subject.progress}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className={`h-full rounded-full ${subject.color}`} style={{ width: `${subject.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-6 md:grid-cols-3">
          {recentLectures.map((lecture, index) => (
            <div key={index} className="card-surface rounded-2xl p-5">
              <p className="text-xs text-slate-500">{lecture.subject}</p>
              <h3 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">{lecture.title}</h3>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-slate-500">{lecture.date}</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">{lecture.status}</span>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
