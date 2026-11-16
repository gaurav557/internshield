import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { db } from '@/lib/prisma';
const secret = new TextEncoder().encode(process.env.AUTH_SECRET || 'development-only-secret-change-this-before-deploying-123');
export async function createSession(user: { id: string; role: string }) {
  const token = await new SignJWT({ sub: user.id, role: user.role }).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('7d').sign(secret);
  (await cookies()).set('internshield_session', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });
}
export async function getSession() {
  try {
    const token = (await cookies()).get('internshield_session')?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, secret);
    if (!payload.sub) return null;
    return db.user.findUnique({ where: { id: String(payload.sub) }, select: { id: true, name: true, email: true, role: true } });
  } catch { return null; }
}
export async function requireUser() { const user = await getSession(); if (!user) throw new Error('UNAUTHORIZED'); return user; }
