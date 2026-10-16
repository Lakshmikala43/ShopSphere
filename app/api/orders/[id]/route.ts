import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: {
          include: {
            product: { include: { images: true } },
            variant: true,
            seller: { select: { storeName: true } },
          },
        },
        history: { orderBy: { createdAt: 'asc' } },
        payments: true,
        returns: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // IDOR Protection: Check ownership unless Admin/Seller
    if (order.userId !== user.userId && user.role !== 'ADMIN' && user.role !== 'SELLER') {
      return NextResponse.json({ error: 'Access denied to this order' }, { status: 403 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error loading order details' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, reason } = await req.json();

    const order = await prisma.order.findUnique({ where: { id: params.id } });
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // IDOR protection
    if (order.userId !== user.userId && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    if (action === 'CANCEL') {
      if (['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.orderStatus)) {
        return NextResponse.json({ error: 'Order cannot be cancelled after shipping' }, { status: 400 });
      }

      const updated = await prisma.$transaction([
        prisma.order.update({
          where: { id: params.id },
          data: { orderStatus: 'CANCELLED' },
        }),
        prisma.orderStatusHistory.create({
          data: {
            orderId: params.id,
            status: 'CANCELLED',
            note: reason || 'Cancelled by customer.',
          },
        }),
      ]);

      return NextResponse.json({ order: updated[0], message: 'Order cancelled successfully' });
    }

    return NextResponse.json({ error: 'Invalid order update action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error updating order' }, { status: 500 });
  }
}
