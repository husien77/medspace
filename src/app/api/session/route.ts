import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'غير مصرح.' }, { status: 401 });
  return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role, status: user.status } });
}
