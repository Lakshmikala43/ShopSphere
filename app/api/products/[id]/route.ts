import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: true,
        variants: true,
        category: true,
        seller: {
          select: { id: true, storeName: true, rating: true, logoUrl: true },
        },
        reviews: {
          include: {
            user: { select: { name: true, avatarUrl: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const avgRating =
      product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
        : 4.5;

    // Fetch similar products
    const similarProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isApproved: true,
      },
      include: { images: true, variants: true, category: true },
      take: 4,
    });

    return NextResponse.json({
      product: {
        ...product,
        averageRating: Math.round(avgRating * 10) / 10,
        reviewCount: product.reviews.length,
      },
      similarProducts,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error loading product details' }, { status: 500 });
  }
}
