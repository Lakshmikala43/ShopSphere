import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { PaymentService } from '@/lib/payment-service';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized checkout' }, { status: 401 });
    }

    const { addressId, couponCode, paymentMethod = 'UPI' } = await req.json();

    if (!addressId) {
      return NextResponse.json({ error: 'Delivery address is required' }, { status: 400 });
    }

    const address = await prisma.address.findFirst({
      where: { id: addressId, userId: user.userId },
    });

    if (!address) {
      return NextResponse.json({ error: 'Selected address not found' }, { status: 404 });
    }

    // Fetch user cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.userId },
      include: {
        product: true,
        variant: true,
      },
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ error: 'Your cart is empty' }, { status: 400 });
    }

    // Recalculate totals server-side
    let subtotal = 0;
    const orderItemsData = [];

    for (const item of cartItems) {
      const price = item.variant ? item.variant.price : item.product.price;
      const stock = item.variant ? item.variant.stock : 20;

      if (stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for product ${item.product.name}. Available: ${stock}` },
          { status: 400 }
        );
      }

      const itemTotal = price * item.quantity;
      subtotal += itemTotal;

      orderItemsData.push({
        productId: item.productId,
        variantId: item.variantId,
        sellerId: item.product.sellerId,
        quantity: item.quantity,
        unitPrice: price,
      });
    }

    // Coupon discount logic
    let discountAmount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase() },
      });

      if (coupon && coupon.isActive && coupon.expiresAt > new Date() && subtotal >= coupon.minSpend) {
        const calculatedDiscount = (subtotal * coupon.discountPercent) / 100;
        discountAmount = Math.min(calculatedDiscount, coupon.maxDiscount);
      }
    }

    const shippingFee = subtotal > 999 ? 0 : 99;
    const taxAmount = Math.round((subtotal - discountAmount) * 0.05);
    const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee + taxAmount);

    const orderNumber = `SK-${Date.now().toString().substring(3)}-${Math.floor(Math.random() * 899 + 100)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.userId,
        subtotal,
        discountAmount,
        shippingFee,
        taxAmount,
        totalAmount,
        couponCode: couponCode || null,
        paymentMethod,
        paymentStatus: 'PENDING',
        orderStatus: 'PLACED',
        shippingAddress: JSON.stringify(address),
        trackingNumber: `TRK-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        estimatedDelivery: '3 - 5 Business Days',
        items: {
          create: orderItemsData,
        },
        history: {
          create: {
            status: 'PLACED',
            note: 'Order placed by customer.',
          },
        },
      },
    });

    if (paymentMethod === 'COD') {
      const codResult = await PaymentService.verifyAndCompletePayment({
        orderId: order.id,
        paymentId: `COD_${Date.now()}`,
        paymentMethod: 'COD',
      });
      return NextResponse.json({ success: true, orderId: order.id, paymentMethod: 'COD' });
    }

    // Create payment gateway order
    const paymentOrder = await PaymentService.createPaymentOrder({
      orderId: order.id,
      amount: totalAmount,
      userId: user.userId,
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      paymentOrder,
      paymentMethod,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error processing checkout' }, { status: 500 });
  }
}
