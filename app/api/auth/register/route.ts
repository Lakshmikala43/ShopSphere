import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signJwtToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { name, email, password, role = 'CUSTOMER', phone } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email is already registered' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: ['CUSTOMER', 'SELLER', 'ADMIN'].includes(role) ? role : 'CUSTOMER',
        phone,
      },
    });

    if (role === 'SELLER') {
      await prisma.seller.create({
        data: {
          userId: user.id,
          storeName: `${name}'s Store`,
          storeDescription: 'Official seller store on StyleKart AI',
        },
      });
    }

    const token = signJwtToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      message: 'Registration successful',
    });

    response.cookies.set('stylekart_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
