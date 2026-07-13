import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('ai-search')
@Controller('ai-search')
export class AiSearchController {
  @Get()
  @ApiOperation({ summary: 'AI-powered expert search (LangChain)' })
  @ApiQuery({ name: 'q', required: true })
  search(@Query('q') q: string) {
    return {
      results: [],
      query: q,
      powered_by: 'LangChain',
      note: 'AI search integration coming soon — connect OpenAI + LangChain',
    };
  }
}
