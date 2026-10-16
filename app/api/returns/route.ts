import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { orderId, reason, comments } = await req.json();

    if (!orderId || !reason) {
      return NextResponse.json({ error: 'Order ID and reason are required' }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: user.userId },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const returnRequest = await prisma.returnRequest.create({
      data: {
        orderId,
        userId: user.userId,
        reason,
        comments,
        status: 'REQUESTED',
      },
    });

    await prisma.order.update({
      where: { id: orderId },
      data: { orderStatus: 'RETURNED' },
    });

    return NextResponse.json({ returnRequest, message: 'Return request submitted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error submitting return' }, { status: 500 });
  }
}
