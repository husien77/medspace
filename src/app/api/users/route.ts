import { NextResponse } from 'next/server';
import { db } from '@/db';
import { auditLogs, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSessionUser, isAuthorizedRole } from '@/lib/auth';

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'غير مصرح.' }, { status: 401 });
  const rows = await db.select({
    id: users.id,
    fullName: users.fullName,
    email: users.email,
    role: users.role,
    status: users.status,
  }).from(users).orderBy(users.createdAt);
  return NextResponse.json(rows);
}

export async function PATCH(request: Request) {
  const actor = await getSessionUser();
  if (!isAuthorizedRole(actor, ['SUPER_ADMIN'])) return NextResponse.json({ error: 'غير مصرح.' }, { status: 403 });

  const body = await request.json().catch(() => null);
  const id = Number(body?.id);
  const status = body?.status;
  if (!Number.isInteger(id) || id < 1) return NextResponse.json({ error: 'معرف المستخدم غير صالح.' }, { status: 400 });
  if (status !== 'APPROVED' && status !== 'REJECTED' && status !== 'SUSPENDED') return NextResponse.json({ error: 'حالة غير صالحة.' }, { status: 400 });

  const [updated] = await db.update(users).set({ status, updatedAt: new Date() }).where(eq(users.id, id)).returning();
  if (!updated) return NextResponse.json({ error: 'المستخدم غير موجود.' }, { status: 404 });

  await db.insert(auditLogs).values({
    actorUserId: actor!.id,
    action: `user.status.${String(status).toLowerCase()}`,
    targetType: 'user',
    targetId: updated.id,
    details: { email: updated.email },
  });

  return NextResponse.json(updated);
}
