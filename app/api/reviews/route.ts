import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Please log in to submit a review' }, { status: 401 });
    }

    const { productId, rating, title, comment } = await req.json();

    if (!productId || !rating || !title || !comment) {
      return NextResponse.json({ error: 'All review fields are required' }, { status: 400 });
    }

    // Check if user purchased the product
    const orderItem = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: { userId: user.userId, paymentStatus: 'SUCCESS' },
      },
    });

    const isVerifiedPurchase = !!orderItem;

    const review = await prisma.review.create({
      data: {
        userId: user.userId,
        productId,
        rating: parseInt(rating, 10),
        title,
        comment,
        isVerifiedPurchase,
      },
    });

    return NextResponse.json({ review, message: 'Review submitted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error submitting review' }, { status: 500 });
  }
}
