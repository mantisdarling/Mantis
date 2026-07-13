import './tracing';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { RedisIoAdapter } from './adapters/redis-io.adapter';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    abortOnError: false,
    rawBody: true, // Required for Stripe webhook signature verification
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.printf(
              ({ timestamp, level, message }) => `[${timestamp}] ${level}: ${message}`,
            ),
          ),
        }),
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        }),
      ],
    }),
  });

  // Security headers
  app.use(helmet());

  // CORS — must exactly match Vercel production URL (no trailing slash)
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Idempotency-Key'],
  });

  // Global validation pipe — strips unknown fields, transforms types
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Socket.io with Redis adapter for horizontal scaling
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  // Swagger API documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('MANTIS API')
    .setDescription(
      'The MANTIS Mentorship Marketplace API — Stop guessing, start talking.\n\n' +
      'Authenticate with the Bearer token returned from POST /auth/login or POST /auth/register.',
    )
    .setVersion('2.0.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication & Authorization')
    .addTag('experts', 'Expert profiles and search')
    .addTag('sessions', 'Mentorship session lifecycle')
    .addTag('payments', 'Stripe escrow payments')
    .addTag('reviews', 'Post-session star ratings')
    .addTag('users', 'User management')
    .addTag('notifications', 'Real-time notifications')
    .addTag('analytics', 'Platform analytics')
    .addTag('ai-concierge', 'AI mentor matching chatbot')
    .addTag('feature-flags', 'Feature flag management')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  // gRPC microservice for internal communication
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'mantis',
      protoPath: join(process.cwd(), 'src/proto/mantis.proto'),
      url: '0.0.0.0:50051',
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3001);

  const url = `http://localhost:${process.env.PORT ?? 3001}`;
  console.log(`\n🚀 MANTIS API running at: ${url}`);
  console.log(`📚 Swagger docs: ${url}/api/docs`);
  console.log(`⚡ gRPC server: 0.0.0.0:50051\n`);
}

bootstrap().catch((err) => {
  console.error('💥 FATAL ERROR DURING BOOTSTRAP:', err);
  process.exit(1);
});
