import { Module, APP_INTERCEPTOR } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bullmq';

// ── Infrastructure (order matters — GlobalRedisModule MUST be first) ──
import { GlobalRedisModule } from './redis-global.module';
import { PrismaModule } from './prisma/prisma.module';

// ── Core Feature Modules ──────────────────────────────────────────────
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ExpertsModule } from './experts/experts.module';
import { SessionsModule } from './sessions/sessions.module';
import { PaymentsModule } from './payments/payments.module';
import { ReviewsModule } from './reviews/reviews.module';
import { NotificationsModule } from './notifications/notifications.module';
import { EmailModule } from './email/email.module';
import { UploadsModule } from './uploads/uploads.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { HealthModule } from './health/health.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { FeatureFlagsModule } from './feature-flags/feature-flags.module';
import { ApiKeysModule } from './api-keys/api-keys.module';

// ── AI Modules ────────────────────────────────────────────────────────
import { AiSearchModule } from './ai-search/ai-search.module';
import { AiConciergeModule } from './ai-concierge/ai-concierge.module';
import { AiPricingModule } from './ai-pricing/ai-pricing.module';

// ── Infrastructure / Resilience Modules ──────────────────────────────
import { GrpcServiceModule } from './grpc-service/grpc-service.module';
import { ChaosModule } from './chaos/chaos.module';
import { DistributedLockModule } from './distributed-lock/distributed-lock.module';
import { RateLimiterModule } from './rate-limiter/rate-limiter.module';
import { CircuitBreakerModule } from './circuit-breaker/circuit-breaker.module';
import { SseModule } from './sse/sse.module';
import { DataResidencyModule } from './data-residency/data-residency.module';
import { FraudModule } from './fraud/fraud.module';

// ── Global Interceptors ───────────────────────────────────────────────
import { IdempotencyInterceptor } from './common/interceptors/idempotency.interceptor';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';

@Module({
  imports: [
    // GlobalRedisModule MUST come first — all other modules depend on Redis being ready
    GlobalRedisModule,

    ConfigModule.forRoot({ isGlobal: true, cache: true }),

    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),

    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: 6379,
      },
    }),

    PrismaModule,
    AuthModule,
    UsersModule,
    ExpertsModule,
    SessionsModule,
    PaymentsModule,
    ReviewsModule,
    NotificationsModule,
    EmailModule,
    UploadsModule,
    AnalyticsModule,
    HealthModule,
    WebhooksModule,
    FeatureFlagsModule,
    ApiKeysModule,
    AiSearchModule,
    AiConciergeModule,
    AiPricingModule,
    GrpcServiceModule,
    ChaosModule,
    DistributedLockModule,
    RateLimiterModule,
    CircuitBreakerModule,
    SseModule,
    DataResidencyModule,
    FraudModule,
  ],
  providers: [
    // Global idempotency — prevents duplicate payment/booking requests
    { provide: APP_INTERCEPTOR, useClass: IdempotencyInterceptor },
    // Global audit logging — records every API action for compliance
    { provide: APP_INTERCEPTOR, useClass: AuditInterceptor },
  ],
})
export class AppModule {}
