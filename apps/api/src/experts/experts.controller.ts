import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ExpertsService } from './experts.service';

@ApiTags('experts')
@Controller('experts')
export class ExpertsController {
  constructor(private readonly expertsService: ExpertsService) {}

  @Get()
  @ApiOperation({ summary: 'List all experts with optional skill/rating filters' })
  @ApiQuery({ name: 'skill', required: false, description: 'Filter by skill e.g. React' })
  @ApiQuery({ name: 'min_rating', required: false, type: Number, description: 'Minimum star rating' })
  findAll(
    @Query('skill') skill?: string,
    @Query('min_rating') minRating?: number,
  ) {
    return this.expertsService.findAll(skill, minRating ? +minRating : undefined);
  }

  @Get('search')
  @ApiOperation({ summary: 'Full-text search experts by name, bio, or headline' })
  @ApiQuery({ name: 'q', required: true, description: 'Search query' })
  search(@Query('q') q: string) {
    return this.expertsService.search(q || '');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single expert profile with reviews' })
  findOne(@Param('id') id: string) {
    return this.expertsService.findOne(id);
  }
}
