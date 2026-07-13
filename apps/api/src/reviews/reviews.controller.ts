import { Controller, Get, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReviewsService } from './reviews.service';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Submit a star rating and review after a session' })
  create(
    @Req() req: any,
    @Body() body: { sessionId: string; expertId: string; rating: number; comment?: string },
  ) {
    return this.reviewsService.create(
      req.user.id, body.sessionId, body.expertId, body.rating, body.comment,
    );
  }

  @Get('expert/:expertId')
  @ApiOperation({ summary: 'Get all reviews for an expert (public)' })
  findByExpert(@Param('expertId') expertId: string) {
    return this.reviewsService.findByExpert(expertId);
  }
}
