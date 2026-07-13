import { Module } from '@nestjs/common';
import { AiConciergeController } from './ai-concierge.controller';

@Module({ controllers: [AiConciergeController] })
export class AiConciergeModule {}
