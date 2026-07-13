import { Controller, Get, Post, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WebhooksService } from './webhooks.service';

@ApiTags('webhooks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new outgoing webhook endpoint' })
  create(@Req() req: any, @Body() body: { url: string; events: string[] }) {
    return this.webhooksService.create(req.user.id, body.url, body.events);
  }

  @Get()
  @ApiOperation({ summary: 'List all webhooks for current user' })
  findAll(@Req() req: any) {
    return this.webhooksService.findByUser(req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a webhook endpoint' })
  delete(@Param('id') id: string) {
    return this.webhooksService.delete(id);
  }
}
