import { NextResponse } from 'next/server';
import { db } from '@/db';
import { auditLogs, lectures, notifications, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSessionUser, isAuthorizedRole } from '@/lib/auth';
import { z } from 'zod';

const schema = z.object({ subjectId: z.number().int().positive(), title: z.string().trim().min(2).max(180), date: z.string().datetime(), lecturerName: z.string().max(120).optional(), notes: z.string().max(2000).optional() });

export async function POST(request: Request) {
  const actor = await getSessionUser();
  if (!isAuthorizedRole(actor, ['SUPER_ADMIN'])) return NextResponse.json({ error: 'غير مصرح.' }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'بيانات المحاضرة غير صالحة.' }, { status: 400 });
  const [lecture] = await db.insert(lectures).values({ ...parsed.data, date: new Date(parsed.data.date), status: 'NOT_COMPLETED' }).returning();
  await db.insert(auditLogs).values({ actorUserId: actor!.id, action: 'lecture.create', targetType: 'lecture', targetId: lecture.id });
  return NextResponse.json(lecture, { status: 201 });
}

export async function PATCH(request: Request) {
  const actor = await getSessionUser();
  if (!isAuthorizedRole(actor, ['SUPER_ADMIN'])) return NextResponse.json({ error: 'غير مصرح.' }, { status: 403 });
  const body = await request.json().catch(() => null);
  if (!body || !Number.isInteger(body.id) || !['NOT_COMPLETED', 'COMPLETED', 'POSTPONED', 'RESCHEDULED'].includes(body.status)) return NextResponse.json({ error: 'بيانات غير صالحة.' }, { status: 400 });
  const [updated] = await db.update(lectures).set({ status: body.status, completedAt: body.status === 'COMPLETED' ? new Date() : null, updatedAt: new Date() }).where(eq(lectures.id, body.id)).returning();
  if (!updated) return NextResponse.json({ error: 'المحاضرة غير موجودة.' }, { status: 404 });
  await db.insert(auditLogs).values({ actorUserId: actor!.id, action: `lecture.status.${body.status.toLowerCase()}`, targetType: 'lecture', targetId: updated.id, details: { subjectId: updated.subjectId } });
  if (body.status === 'COMPLETED') {
    const students = await db.select({ id: users.id }).from(users).where(eq(users.status, 'APPROVED'));
    if (students.length) await db.insert(notifications).values(students.map((student) => ({ userId: student.id, title: 'محاضرة مكتملة', message: updated.title, kind: 'lecture.completed', route: `/subjects/${updated.subjectId}` })));
  }
  return NextResponse.json({ lecture: updated });
}
