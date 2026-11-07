import { redirect } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/db';
import { subjects, lectures } from '@/db/schema';
import { and, count, eq } from 'drizzle-orm';
import { getSessionUser } from '@/lib/auth';

export default async function SubjectsPage() {
  const user = await getSessionUser(); if (!user) redirect('/login');
  const rows = await db.select({ id: subjects.id, name: subjects.name, description: subjects.description, color: subjects.color, total: count(lectures.id) }).from(subjects).leftJoin(lectures, eq(lectures.subjectId, subjects.id)).where(and(eq(subjects.isActive, true), ...(user.role === 'STUDENT' ? [eq(subjects.isVisible, true)] : []))).groupBy(subjects.id).orderBy(subjects.sortOrder);
  const completedRows = await db.select({ subjectId: lectures.subjectId, completed: count(lectures.id) }).from(lectures).where(eq(lectures.status, 'COMPLETED')).groupBy(lectures.subjectId);
  const completedMap = new Map(completedRows.map((row) => [row.subjectId, row.completed]));
  return <main className="mx-auto max-w-7xl px-5 py-8"><header className="mb-7 flex items-center justify-between"><div><Link href="/dashboard" className="text-sm text-medspace-700">← لوحة التحكم</Link><h1 className="mt-2 text-3xl font-black">المواد الدراسية</h1></div></header>{rows.length ? <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{rows.map((s) => {const completed = completedMap.get(s.id) ?? 0; const progress = s.total ? Math.round(completed / s.total * 100) : 0; return <Link key={s.id} href={`/subjects/${s.id}`} className="card-surface rounded-2xl p-5 transition hover:-translate-y-1"><div className="mb-4 h-2 rounded-full" style={{ backgroundColor: s.color }}/><h2 className="text-xl font-black">{s.name}</h2><p className="mt-2 min-h-12 text-sm text-slate-500">{s.description || 'لا يوجد وصف للمادة.'}</p><div className="mt-4 flex justify-between text-sm"><span>{completed}/{s.total} محاضرة مكتملة</span><strong>{progress}%</strong></div><div className="mt-2 h-2 rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-2 rounded-full" style={{ width: `${progress}%`, backgroundColor: s.color }}/></div></Link>})}</section> : <p className="card-surface rounded-2xl p-6 text-slate-500">لم تتم إضافة مواد دراسية بعد.</p>}</main>;
}
