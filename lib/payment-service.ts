import crypto from 'crypto';
import { prisma } from './prisma';

export interface CreatePaymentOrderOptions {
  orderId: string;
  amount: number;
  currency?: string;
  userId: string;
}

export interface VerifyPaymentOptions {
  orderId: string;
  paymentId: string;
  gatewayOrderId?: string;
  signature?: string;
  paymentMethod: string;
}

export interface WebhookPayload {
  event: string;
  payload: {
    payment: {
      entity: {
        id: string;
        order_id: string;
        amount: number;
        status: string;
        method: string;
      };
    };
  };
}

export class PaymentService {
  /**
   * Creates a payment gateway order (Razorpay compatible or Sandbox)
   */
  static async createPaymentOrder(options: CreatePaymentOrderOptions) {
    const { orderId, amount, currency = 'INR' } = options;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error('Order not found for payment creation');
    }

    const gatewayOrderId = `rzp_order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Create a pending transaction record
    const transaction = await prisma.paymentTransaction.create({
      data: {
        orderId: order.id,
        provider: 'RAZORPAY_SANDBOX',
        transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        orderIdGateway: gatewayOrderId,
        amount: amount,
        status: 'PENDING',
      },
    });

    return {
      success: true,
      gatewayOrderId,
      transactionId: transaction.transactionId,
      amount,
      currency,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_stylekart123',
    };
  }

  /**
   * Process a Sandbox Payment or Verify Razorpay Signature Server-Side
   */
  static async verifyAndCompletePayment(options: VerifyPaymentOptions) {
    const { orderId, paymentId, gatewayOrderId, signature, paymentMethod } = options;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        user: true,
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    // Handle Cash on Delivery
    if (paymentMethod === 'COD') {
      await prisma.$transaction([
        prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: 'PENDING',
            orderStatus: 'CONFIRMED',
          },
        }),
        prisma.orderStatusHistory.create({
          data: {
            orderId,
            status: 'CONFIRMED',
            note: 'Order confirmed with Cash on Delivery payment option.',
          },
        }),
      ]);

      // Reduce Inventory
      await this.reduceInventory(order.items);
      // Clear User Cart
      await prisma.cartItem.deleteMany({ where: { userId: order.userId } });

      return { success: true, message: 'COD Order Confirmed', orderId };
    }

    // Verify online payment (Razorpay / Sandbox)
    let isSignatureValid = true;

    if (signature && process.env.RAZORPAY_KEY_SECRET) {
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${gatewayOrderId}|${paymentId}`)
        .digest('hex');

      isSignatureValid = generatedSignature === signature;
    }

    if (!isSignatureValid) {
      throw new Error('Invalid payment signature. Payment verification failed!');
    }

    // Check idempotency - prevent double processing
    if (order.paymentStatus === 'SUCCESS') {
      return { success: true, message: 'Payment already processed successfully', orderId };
    }

    // Execute atomic transaction for payment success
    await prisma.$transaction([
      prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'SUCCESS',
          orderStatus: 'CONFIRMED',
        },
      }),
      prisma.paymentTransaction.create({
        data: {
          orderId: order.id,
          provider: 'RAZORPAY_SANDBOX',
          transactionId: paymentId || `PAY_${Date.now()}`,
          orderIdGateway: gatewayOrderId,
          signature: signature || 'SANDBOX_VERIFIED_SIGNATURE',
          amount: order.totalAmount,
          status: 'SUCCESS',
          rawData: JSON.stringify({ paymentMethod, verifiedAt: new Date().toISOString() }),
        },
      }),
      prisma.orderStatusHistory.create({
        data: {
          orderId,
          status: 'CONFIRMED',
          note: `Payment verified successfully via ${paymentMethod}.`,
        },
      }),
    ]);

    // Reduce inventory safely
    await this.reduceInventory(order.items);

    // Clear user cart
    await prisma.cartItem.deleteMany({
      where: { userId: order.userId },
    });

    return {
      success: true,
      message: 'Payment verified and order confirmed successfully',
      orderId,
    };
  }

  /**
   * Handles webhook verification and processing
   */
  static async handlePaymentWebhook(rawBody: string, signature: string) {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'whsec_stylekart_webhook_secret_999';
    
    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      throw new Error('Invalid webhook signature');
    }

    const payload: WebhookPayload = JSON.parse(rawBody);

    if (payload.event === 'payment.captured') {
      const payment = payload.payload.payment.entity;
      const gatewayOrderId = payment.order_id;

      // Find transaction
      const transaction = await prisma.paymentTransaction.findFirst({
        where: { orderIdGateway: gatewayOrderId },
      });

      if (transaction) {
        await this.verifyAndCompletePayment({
          orderId: transaction.orderId,
          paymentId: payment.id,
          gatewayOrderId: payment.order_id,
          paymentMethod: payment.method.toUpperCase(),
        });
      }
    }

    return { received: true };
  }

  /**
   * Helper to safely reduce product variant inventory
   */
  private static async reduceInventory(items: { productId: string; variantId: string | null; quantity: number }[]) {
    for (const item of items) {
      if (item.variantId) {
        await prisma.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }
  }
}
