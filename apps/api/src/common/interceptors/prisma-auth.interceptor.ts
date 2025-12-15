// prisma-auth.interceptor.ts
import { Prisma } from '@/generated/prisma/client';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export function isPrismaNotFound(err: unknown): boolean {
  return (
    err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025'
  );
}

@Injectable()
export class PrismaAuthInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        if (isPrismaNotFound(err)) {
          return throwError(
            () => new UnauthorizedException('invalid_credentials'),
          );
        }

        return throwError(() => err);
      }),
    );
  }
}
