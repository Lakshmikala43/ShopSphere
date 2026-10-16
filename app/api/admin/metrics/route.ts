import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin authorization required' }, { status: 403 });
    }

    const [
      totalUsers,
      totalSellers,
      totalProducts,
      totalOrders,
      ordersAgg,
      pendingOrders,
      cancelledOrders,
      topCategories,
      recentOrders,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.seller.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { paymentStatus: 'SUCCESS' },
      }),
      prisma.order.count({ where: { orderStatus: 'PLACED' } }),
      prisma.order.count({ where: { orderStatus: 'CANCELLED' } }),
      prisma.category.findMany({
        take: 5,
        include: { _count: { select: { products: true } } },
      }),
      prisma.order.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } } },
      }),
    ]);

    const totalRevenue = ordersAgg._sum.totalAmount || 0;

    // Monthly chart data simulation
    const salesChart = [
      { name: 'Jan', sales: Math.round(totalRevenue * 0.12) },
      { name: 'Feb', sales: Math.round(totalRevenue * 0.15) },
      { name: 'Mar', sales: Math.round(totalRevenue * 0.18) },
      { name: 'Apr', sales: Math.round(totalRevenue * 0.22) },
      { name: 'May', sales: Math.round(totalRevenue * 0.14) },
      { name: 'Jun', sales: Math.round(totalRevenue * 0.19) },
    ];

    return NextResponse.json({
      metrics: {
        totalRevenue,
        totalUsers,
        totalSellers,
        totalProducts,
        totalOrders,
        pendingOrders,
        cancelledOrders,
      },
      topCategories: topCategories.map((c) => ({ id: c.id, name: c.name, productCount: c._count.products })),
      recentOrders,
      salesChart,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching admin metrics' }, { status: 500 });
  }
}
