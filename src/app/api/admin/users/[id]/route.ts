import { NextResponse } from 'next/server';
import { getSessionUser, isAuthorizedRole } from '@/lib/auth';
import { db } from '@/db';
import { auditLogs, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const actor = await getSessionUser();
  if (!isAuthorizedRole(actor, ['SUPER_ADMIN'])) return NextResponse.json({ error: 'غير مصرح.' }, { status: 403 });
  const id = Number(params.id);
  if (!Number.isSafeInteger(id) || id < 1) return NextResponse.json({ error: 'معرف غير صالح.' }, { status: 400 });
  const form = await request.formData().catch(() => null);
  const status = form?.get('status');
  if (status !== 'APPROVED' && status !== 'REJECTED' && status !== 'SUSPENDED') return NextResponse.json({ error: 'حالة غير صالحة.' }, { status: 400 });
  const [updated] = await db.update(users).set({ status, updatedAt: new Date() }).where(eq(users.id, id)).returning({ id: users.id, email: users.email });
  if (!updated) return NextResponse.json({ error: 'المستخدم غير موجود.' }, { status: 404 });
  await db.insert(auditLogs).values({ actorUserId: actor!.id, action: `user.status.${status.toLowerCase()}`, targetType: 'user', targetId: id });
  return NextResponse.redirect(new URL('/admin', request.url), { status: 303 });
}
