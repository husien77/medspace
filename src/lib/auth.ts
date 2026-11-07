import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { hash, compare } from 'bcryptjs';

export type AppRole = 'SUPER_ADMIN' | 'STUDENT';
export type AppStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

export const AUTH_SECRET = process.env.AUTH_SECRET || 'medspace-dev-secret';

export type SessionUser = {
  id: number;
  email: string;
  fullName: string;
  role: AppRole;
  status: AppStatus;
};

export async function hashPassword(password: string) {
  return hash(password, 12);
}

export async function verifyPassword(password: string, hashValue: string) {
  return compare(password, hashValue);
}

export async function signSessionToken(payload: SessionUser) {
  const secret = new TextEncoder().encode(AUTH_SECRET);
  return new SignJWT({
    sub: String(payload.id),
    email: payload.email,
    fullName: payload.fullName,
    role: payload.role,
    status: payload.status,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifySessionToken(token: string) {
  const secret = new TextEncoder().encode(AUTH_SECRET);
  const { payload } = await jwtVerify(token, secret);
  return payload as SessionUser & { sub: string };
}

export async function getSessionUser() {
  const cookieStore = cookies();
  const session = cookieStore.get('medspace_session')?.value;

  if (!session) {
    return null;
  }

  try {
    const claims = await verifySessionToken(session);
    return {
      id: Number(claims.sub),
      email: String(claims.email),
      fullName: String(claims.fullName),
      role: String(claims.role) as AppRole,
      status: String(claims.status) as AppStatus,
    } satisfies SessionUser;
  } catch {
    return null;
  }
}

export function isAuthorizedRole(user: SessionUser | null, roles: AppRole[]) {
  if (!user) return false;
  return roles.includes(user.role);
}
