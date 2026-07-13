import { Controller, Get, Post, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiKeysService } from './api-keys.service';

@ApiTags('api-keys')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api-keys')
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Post()
  @ApiOperation({ summary: 'Generate a new API key (raw key shown only once)' })
  create(@Req() req: any, @Body() body: { name: string }) {
    return this.apiKeysService.create(req.user.id, body.name);
  }

  @Get()
  @ApiOperation({ summary: 'List all API keys (without raw key values)' })
  findAll(@Req() req: any) {
    return this.apiKeysService.findByUser(req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Revoke an API key permanently' })
  revoke(@Param('id') id: string) {
    return this.apiKeysService.revoke(id);
  }
}
