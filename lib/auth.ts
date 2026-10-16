import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'stylekart-ai-super-secret-jwt-key-2026';

export interface UserPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

export function signJwtToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyJwtToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch (error) {
    return null;
  }
}

export async function getCurrentUser(): Promise<UserPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get('stylekart_token')?.value;
  if (!token) return null;
  return verifyJwtToken(token);
}

export async function requireAuth(allowedRoles?: string[]): Promise<UserPayload> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    throw new Error('Forbidden: Access denied');
  }
  return user;
}
