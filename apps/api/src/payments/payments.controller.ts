import { Controller, Post, Body, UseGuards, Req, Headers, RawBodyRequest } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaymentsService } from './payments.service';
import { Request } from 'express';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-intent')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a Stripe payment intent (funds held in escrow)' })
  createIntent(@Req() req: any, @Body() body: { payeeId: string; amount: number }) {
    return this.paymentsService.createPaymentIntent(req.user.id, body.payeeId, body.amount);
  }

  @Post('capture')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Release escrow funds to expert after session completion' })
  capture(@Body() body: { paymentIntentId: string }) {
    return this.paymentsService.capturePayment(body.paymentIntentId);
  }

  @Post('refund')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Refund a payment to the learner' })
  refund(@Body() body: { paymentIntentId: string }) {
    return this.paymentsService.refundPayment(body.paymentIntentId);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Stripe webhook handler (receives payment events)' })
  webhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    return this.paymentsService.handleWebhook(signature, req.rawBody as Buffer);
  }
}
