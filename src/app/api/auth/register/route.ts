import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { users } from '@/db/schema';
import { hashPassword } from '@/lib/auth';

const registerSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(12).max(128),
});

export async function POST(request: Request) {
  try {
    const parsed = registerSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: 'تحقق من الاسم والبريد وكلمة المرور (12 محرفاً على الأقل).' }, { status: 400 });
    const { fullName, email, password } = parsed.data;
    const passwordHash = await hashPassword(password);
    const [user] = await db.insert(users).values({ fullName, email, passwordHash, role: 'STUDENT', status: 'PENDING' }).returning({ id: users.id });
    return NextResponse.json({ message: 'تم إنشاء الحساب. ينتظر الحساب موافقة الإدارة قبل تسجيل الدخول.', userId: user.id }, { status: 201 });
  } catch (error) {
    if (typeof error === 'object' && error && 'code' in error && error.code === '23505') return NextResponse.json({ error: 'هذا البريد مسجل مسبقاً.' }, { status: 409 });
    console.error('Registration failed', error);
    return NextResponse.json({ error: 'تعذر إنشاء الحساب حالياً.' }, { status: 500 });
  }
}
