import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Health check — confirms API is alive' })
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'MANTIS API',
      version: '2.0.0',
    };
  }
}
