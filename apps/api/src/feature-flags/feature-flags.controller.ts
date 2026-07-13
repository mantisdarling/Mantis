import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FeatureFlagsService } from './feature-flags.service';

@ApiTags('feature-flags')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('feature-flags')
export class FeatureFlagsController {
  constructor(private readonly featureFlagsService: FeatureFlagsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new feature flag' })
  create(@Body() body: { key: string; description: string; isEnabled: boolean; percentage?: number }) {
    return this.featureFlagsService.create(body.key, body.description, body.isEnabled, body.percentage);
  }

  @Get()
  @ApiOperation({ summary: 'List all feature flags' })
  findAll() { return this.featureFlagsService.findAll(); }

  @Get(':key/evaluate')
  @ApiOperation({ summary: 'Evaluate if a feature flag is active (canary-aware)' })
  evaluate(@Param('key') key: string) {
    return this.featureFlagsService.evaluate(key).then((enabled) => ({ key, enabled }));
  }

  @Put(':key')
  @ApiOperation({ summary: 'Update a feature flag' })
  update(@Param('key') key: string, @Body() data: any) {
    return this.featureFlagsService.update(key, data);
  }

  @Delete(':key')
  @ApiOperation({ summary: 'Delete a feature flag' })
  delete(@Param('key') key: string) { return this.featureFlagsService.delete(key); }
}
