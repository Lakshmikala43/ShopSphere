import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) {
    return NextResponse.json({ user: null });
  }

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.userId },
    select: { id: true, name: true, email: true, role: true, phone: true, avatarUrl: true },
  });

  return NextResponse.json({ user });
}
