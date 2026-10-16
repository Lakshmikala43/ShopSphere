import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ addresses: [] });

    const addresses = await prisma.address.findMany({
      where: { userId: user.userId },
      orderBy: { isDefault: 'desc' },
    });

    return NextResponse.json({ addresses });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching addresses' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { fullName, phone, line1, line2, city, state, postalCode, country = 'India', isDefault = false } = body;

    if (!fullName || !phone || !line1 || !city || !state || !postalCode) {
      return NextResponse.json({ error: 'Missing required address fields' }, { status: 400 });
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.userId },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: user.userId,
        fullName,
        phone,
        line1,
        line2,
        city,
        state,
        postalCode,
        country,
        isDefault,
      },
    });

    return NextResponse.json({ address, message: 'Address added successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error adding address' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const addressId = searchParams.get('id');

    if (!addressId) return NextResponse.json({ error: 'Address ID required' }, { status: 400 });

    await prisma.address.deleteMany({
      where: { id: addressId, userId: user.userId },
    });

    return NextResponse.json({ message: 'Address deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error deleting address' }, { status: 500 });
  }
}
