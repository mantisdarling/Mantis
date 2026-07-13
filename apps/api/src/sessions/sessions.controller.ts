import { Controller, Get, Post, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SessionsService } from './sessions.service';

@ApiTags('sessions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new mentorship session booking' })
  create(@Req() req: any, @Body() body: { expertId: string }) {
    return this.sessionsService.create(req.user.id, body.expertId);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get all sessions for the current user' })
  findMy(@Req() req: any) {
    return this.sessionsService.findByUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a session by ID including messages and transcript' })
  findOne(@Param('id') id: string) {
    return this.sessionsService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update session status (ACTIVE, COMPLETED, CANCELED)' })
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.sessionsService.updateStatus(id, body.status);
  }
}
