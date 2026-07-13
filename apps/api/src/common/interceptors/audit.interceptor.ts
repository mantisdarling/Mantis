import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user, headers, ip } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap(async () => {
        const response = context.switchToHttp().getResponse();
        try {
          await this.prisma.auditLog.create({
            data: {
              action: method,
              endpoint: url,
              userId: user?.id || null,
              ipAddress: ip || 'unknown',
              userAgent: headers['user-agent'] || 'unknown',
              statusCode: response.statusCode,
              details: `Duration: ${Date.now() - startTime}ms`,
            },
          });
        } catch (_) {}
      }),
    );
  }
}
