import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(private readonly prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2024-06-20' as any,
    });
  }

  async createPaymentIntent(payerId: string, payeeId: string, amount: number) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      capture_method: 'manual', // holds in escrow
      metadata: { payerId, payeeId },
    });

    await this.prisma.payment.create({
      data: { payerId, payeeId, amount, status: 'ESCROW', stripePiId: paymentIntent.id },
    });

    return { clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id };
  }

  async capturePayment(paymentIntentId: string) {
    const pi = await this.stripe.paymentIntents.capture(paymentIntentId);
    await this.prisma.payment.update({
      where: { stripePiId: paymentIntentId },
      data: { status: 'COMPLETED' },
    });
    return { success: true, paymentIntent: pi.id, status: 'COMPLETED' };
  }

  async refundPayment(paymentIntentId: string) {
    const refund = await this.stripe.refunds.create({ payment_intent: paymentIntentId });
    await this.prisma.payment.update({
      where: { stripePiId: paymentIntentId },
      data: { status: 'REFUNDED' },
    });
    return { success: true, refundId: refund.id, status: 'REFUNDED' };
  }

  async handleWebhook(signature: string, payload: Buffer) {
    const event = this.stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || '',
    );
    // Handle specific Stripe events here as needed
    return { received: true, type: event.type };
  }
}
