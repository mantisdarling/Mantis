import { Module } from '@nestjs/common';
import { FeatureFlagsController } from './feature-flags.controller';
import { FeatureFlagsService } from './feature-flags.service';

@Module({ controllers: [FeatureFlagsController], providers: [FeatureFlagsService] })
export class FeatureFlagsModule {}
