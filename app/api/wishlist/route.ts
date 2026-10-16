import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ wishlistItems: [] });
    }

    const items = await prisma.wishlistItem.findMany({
      where: { userId: user.userId },
      include: {
        product: {
          include: { images: true, variants: true, category: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ wishlistItems: items });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching wishlist' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Please log in to manage your wishlist' }, { status: 401 });
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const existing = await prisma.wishlistItem.findFirst({
      where: { userId: user.userId, productId },
    });

    if (existing) {
      await prisma.wishlistItem.delete({ where: { id: existing.id } });
      return NextResponse.json({ isWishlisted: false, message: 'Removed from wishlist' });
    }

    await prisma.wishlistItem.create({
      data: { userId: user.userId, productId },
    });

    return NextResponse.json({ isWishlisted: true, message: 'Added to wishlist' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error toggling wishlist' }, { status: 500 });
  }
}
