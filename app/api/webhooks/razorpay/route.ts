import { NextResponse } from 'next/server';
import { PaymentService } from '@/lib/payment-service';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature') || '';

    const result = await PaymentService.handlePaymentWebhook(rawBody, signature);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Webhook handling failed' }, { status: 400 });
  }
}
