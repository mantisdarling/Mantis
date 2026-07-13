import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const idempotencyKey = request.headers['idempotency-key'];

    if (!idempotencyKey || request.method === 'GET') {
      return next.handle();
    }

    const cached = await this.redis.get(`idempotency:${idempotencyKey}`);
    if (cached) {
      const response = context.switchToHttp().getResponse();
      response.json(JSON.parse(cached));
      return new Observable((observer) => observer.complete());
    }

    return next.handle().pipe(
      tap(async (data) => {
        await this.redis.setex(
          `idempotency:${idempotencyKey}`,
          86400,
          JSON.stringify(data),
        );
      }),
    );
  }
}
