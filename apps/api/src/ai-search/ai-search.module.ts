import { Module } from '@nestjs/common';
import { AiSearchController } from './ai-search.controller';

@Module({ controllers: [AiSearchController] })
export class AiSearchModule {}
