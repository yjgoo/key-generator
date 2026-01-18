import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { ensureSchema, getRows, sql } from '@/lib/db';

const AUTH_SECRET = process.env.AUTH_SECRET || 'dev-secret-change-me';
const SESSION_COOKIE = 'kg_admin_session';

export type SessionPayload = {
  sub: string;
  email: string;
  role: 'admin' | 'author';
};

const getSecretKey = () => new TextEncoder().encode(AUTH_SECRET);

export async function createSession(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecretKey());
}

export async function verifySession(token: string) {
  try {
    const { payload } = await jwtVerify<SessionPayload>(token, getSecretKey());
    return payload;
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }
  return verifySession(token);
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function ensureAdminSeed() {
  await ensureSchema();

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return;
  }

  const existing = await sql`
    SELECT id FROM users WHERE email = ${adminEmail} LIMIT 1;
  `;

  const rows = getRows(existing) as { id: string }[];
  if (rows.length > 0) {
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await sql`
    INSERT INTO users (email, password_hash, role)
    VALUES (${adminEmail}, ${passwordHash}, 'admin');
  `;
}

export async function authenticateAdmin(email: string, password: string) {
  await ensureAdminSeed();

  const result = await sql`
    SELECT id, email, password_hash, role
    FROM users
    WHERE email = ${email}
    LIMIT 1;
  `;

  const rows = getRows(result) as {
    id: string;
    email: string;
    password_hash: string;
    role: 'admin' | 'author';
  }[];
  if (rows.length === 0) {
    return null;
  }

  const user = rows[0];
  const matches = await bcrypt.compare(password, user.password_hash);
  if (!matches) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
}
