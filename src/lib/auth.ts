import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { hash, compare } from 'bcryptjs';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export type AppRole = 'SUPER_ADMIN' | 'STUDENT';
export type AppStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
export type SessionUser = { id: number; email: string; fullName: string; role: AppRole; status: AppStatus };
const COOKIE_NAME = 'medspace_session';

function getSecret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) throw new Error('AUTH_SECRET must contain at least 32 characters.');
  return new TextEncoder().encode(value);
}

export async function hashPassword(password: string) { return hash(password, 12); }
export async function verifyPassword(password: string, passwordHash: string) { return compare(password, passwordHash); }

export async function signSessionToken(user: SessionUser) {
  return new SignJWT({ email: user.email, fullName: user.fullName })
    .setProtectedHeader({ alg: 'HS256' }).setSubject(String(user.id)).setIssuedAt().setExpirationTime('8h').sign(getSecret());
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const id = Number(payload.sub);
    if (!Number.isSafeInteger(id) || id < 1) return null;
    const [user] = await db.select({ id: users.id, email: users.email, fullName: users.fullName, role: users.role, status: users.status }).from(users).where(eq(users.id, id)).limit(1);
    if (!user || user.status !== 'APPROVED') return null;
    return user;
  } catch { return null; }
}

export function setSessionCookie(token: string) {
  cookies().set(COOKIE_NAME, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 8 });
}

export function clearSessionCookie() {
  cookies().set(COOKIE_NAME, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 0 });
}

export function isAuthorizedRole(user: SessionUser | null, roles: AppRole[]) { return Boolean(user && user.status === 'APPROVED' && roles.includes(user.role)); }
