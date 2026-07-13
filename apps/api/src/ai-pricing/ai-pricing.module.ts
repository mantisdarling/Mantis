import { Module } from '@nestjs/common';
import { AiPricingController } from './ai-pricing.controller';

@Module({ controllers: [AiPricingController] })
export class AiPricingModule {}
