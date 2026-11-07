import { NextResponse } from 'next/server';
import { db } from '@/db';
import { subjects, lectures } from '@/db/schema';
import { and, asc, count, eq } from 'drizzle-orm';
import { getSessionUser, isAuthorizedRole } from '@/lib/auth';

export async function GET() {
  const user = await getSessionUser();
  if (!isAuthorizedRole(user, ['STUDENT', 'SUPER_ADMIN'])) return NextResponse.json({ error: 'غير مصرح.' }, { status: 401 });
  const rows = await db.select({ id: subjects.id, name: subjects.name, description: subjects.description, icon: subjects.icon, color: subjects.color, order: subjects.sortOrder, total: count(lectures.id) })
    .from(subjects).leftJoin(lectures, eq(lectures.subjectId, subjects.id)).where(and(eq(subjects.isActive, true), ...(user.role === 'STUDENT' ? [eq(subjects.isVisible, true)] : [])))
    .groupBy(subjects.id).orderBy(asc(subjects.sortOrder));
  const completedRows = await db.select({ subjectId: lectures.subjectId, completed: count(lectures.id) }).from(lectures).where(eq(lectures.status, 'COMPLETED')).groupBy(lectures.subjectId);
  const completedMap = new Map(completedRows.map((row) => [row.subjectId, row.completed]));
  return NextResponse.json(rows.map((row) => ({ ...row, completed: completedMap.get(row.id) ?? 0, progress: row.total ? Math.round(((completedMap.get(row.id) ?? 0) / row.total) * 100) : 0 })));
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!isAuthorizedRole(user, ['SUPER_ADMIN'])) return NextResponse.json({ error: 'غير مصرح.' }, { status: 403 });
  const body = await request.json().catch(() => null);
  if (!body || typeof body.name !== 'string' || body.name.trim().length < 2 || body.name.length > 120) return NextResponse.json({ error: 'اسم المادة مطلوب.' }, { status: 400 });
  const [subject] = await db.insert(subjects).values({ name: body.name.trim(), description: typeof body.description === 'string' ? body.description.slice(0, 1000) : '', icon: typeof body.icon === 'string' ? body.icon.slice(0, 40) : 'book-open', color: /^#[0-9a-fA-F]{6}$/.test(body.color) ? body.color : '#0d6fe8' }).returning();
  await db.insert((await import('@/db/schema')).auditLogs).values({ actorUserId: user!.id, action: 'subject.create', targetType: 'subject', targetId: subject.id, details: { name: subject.name } });
  return NextResponse.json(subject, { status: 201 });
}
