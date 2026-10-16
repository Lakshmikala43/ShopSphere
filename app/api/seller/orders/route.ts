import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'SELLER' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const seller = await prisma.seller.findUnique({ where: { userId: user.userId } });

    const orderItems = await prisma.orderItem.findMany({
      where: user.role === 'ADMIN' ? {} : { sellerId: seller?.id },
      include: {
        order: {
          include: { user: { select: { name: true, email: true, phone: true } } },
        },
        product: true,
        variant: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orderItems });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching seller orders' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'SELLER' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId, status, trackingNumber, courierName } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Order ID and status required' }, { status: 400 });
    }

    const updated = await prisma.$transaction([
      prisma.order.update({
        where: { id: orderId },
        data: {
          orderStatus: status,
          ...(trackingNumber ? { trackingNumber } : {}),
          ...(courierName ? { courierName } : {}),
        },
      }),
      prisma.orderStatusHistory.create({
        data: {
          orderId,
          status,
          note: `Order status updated to ${status} by seller. Tracking: ${trackingNumber || 'N/A'}`,
        },
      }),
    ]);

    return NextResponse.json({ order: updated[0], message: `Order status updated to ${status}` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error updating order status' }, { status: 500 });
  }
}
