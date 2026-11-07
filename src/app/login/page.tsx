'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setBusy(true);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: form.get('email'), password: form.get('password') }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'تعذر تسجيل الدخول.');
      window.location.assign('/dashboard');
    } catch (e) { setError(e instanceof Error ? e.message : 'تعذر تسجيل الدخول.'); }
    finally { setBusy(false); }
  }
  return <main className="mx-auto flex min-h-screen max-w-lg items-center px-5"><section className="card-surface w-full rounded-[28px] p-8"><Link href="/" className="text-sm font-bold text-medspace-700">MEDSPACE</Link><h1 className="mt-5 text-3xl font-black">تسجيل الدخول</h1><p className="mt-2 text-slate-500">أهلاً بعودتك إلى مساحتك الأكاديمية.</p><form onSubmit={submit} className="mt-7 space-y-4"><label className="block text-sm font-bold">البريد الإلكتروني<input name="email" type="email" required autoComplete="email" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900" /></label><label className="block text-sm font-bold">كلمة المرور<input name="password" type="password" required autoComplete="current-password" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900" /></label>{error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<button disabled={busy} className="btn-primary w-full disabled:opacity-60">{busy ? 'جارٍ الدخول…' : 'دخول'}</button></form><p className="mt-5 text-sm text-slate-500">ليس لديك حساب؟ <Link className="font-bold text-medspace-700" href="/register">إنشاء حساب</Link></p></section></main>;
}
