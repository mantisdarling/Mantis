import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('ai-concierge')
@Controller('ai-concierge')
export class AiConciergeController {
  @Post('chat')
  @ApiOperation({ summary: 'AI Concierge — match learner to the best expert' })
  chat(@Body() body: { message: string }) {
    const greetings = [
      "I can help you find the right mentor! What skills are you looking to develop?",
      "Tell me more about your challenge — I'll match you with the perfect expert.",
      "What's blocking you right now? I'll find you a mentor who's solved exactly that.",
    ];
    return {
      reply: greetings[Math.floor(Math.random() * greetings.length)],
      suggestions: [],
      powered_by: 'MANTIS AI Concierge',
      note: 'Full LangChain integration coming soon',
    };
  }
}
