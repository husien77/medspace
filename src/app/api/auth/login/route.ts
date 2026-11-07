import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { setSessionCookie, signSessionToken, verifyPassword } from '@/lib/auth';

const schema = z.object({ email: z.string().email().max(254).transform((value) => value.toLowerCase()), password: z.string().min(1).max(128) });

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: 'بيانات الدخول غير صحيحة.' }, { status: 400 });
    const [user] = await db.select().from(users).where(eq(users.email, parsed.data.email)).limit(1);
    if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) return NextResponse.json({ error: 'البريد أو كلمة المرور غير صحيحة.' }, { status: 401 });
    if (user.status !== 'APPROVED') return NextResponse.json({ error: user.status === 'PENDING' ? 'الحساب بانتظار موافقة الإدارة.' : 'لا يمكن الدخول بهذا الحساب.' }, { status: 403 });
    const token = await signSessionToken({ id: user.id, email: user.email, fullName: user.fullName, role: user.role, status: user.status });
    setSessionCookie(token);
    return NextResponse.json({ user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role } });
  } catch (error) {
    console.error('Login failed', error);
    return NextResponse.json({ error: 'تعذر تسجيل الدخول حالياً.' }, { status: 500 });
  }
}
