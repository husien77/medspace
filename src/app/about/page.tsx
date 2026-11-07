export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="card-surface rounded-[28px] p-8">
        <p className="text-sm font-medium text-medspace-700 dark:text-medspace-300">Designed & Owned by</p>
        <h1 className="mt-2 text-4xl font-black text-slate-900 dark:text-white">الحسين الغرسي</h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">رؤية المنصة</h2>
            <p className="text-lg leading-9 text-slate-600 dark:text-slate-300">
              MEDSPACE تم تصميمها لتكون بيئة أكاديمية طبية متكاملة تجمع التعلم، التقييم، الدورات، الملفات الأكاديمية، والإدارة في منصة واحدة مصممة خصيصاً لطلبة الطب البشري.
            </p>
            <p className="text-lg leading-9 text-slate-600 dark:text-slate-300">
              نؤمن بأن التعلم الطبي يحتاج إلى تنظيم ذكي، واجهة واضحة، وأمان حقيقي، لذلك تم بناء النظام مع تركيز على الأداء، الثبات، وسهولة الوصول عبر الهاتف أو الكمبيوتر.
            </p>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-medspace-600 to-medspace-900 p-6 text-white shadow-soft">
            <p className="text-sm text-medspace-100">القيم</p>
            <ul className="mt-4 space-y-3 text-base text-medspace-50">
              <li>• تعليم موجه واحترافي</li>
              <li>• أمان وحماية للمستخدمين</li>
              <li>• تنسيق عربي كامل ودعم RTL</li>
              <li>• تجربة PWA وبدعم اتصال غير متصل</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
