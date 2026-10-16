import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { PaymentService } from '@/lib/payment-service';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized payment verification' }, { status: 401 });
    }

    const { orderId, paymentId, gatewayOrderId, signature, paymentMethod } = await req.json();

    if (!orderId || !paymentMethod) {
      return NextResponse.json({ error: 'Order ID and payment method required' }, { status: 400 });
    }

    const result = await PaymentService.verifyAndCompletePayment({
      orderId,
      paymentId: paymentId || `SANDBOX_PAY_${Date.now()}`,
      gatewayOrderId,
      signature,
      paymentMethod,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Payment verification failed' }, { status: 400 });
  }
}
