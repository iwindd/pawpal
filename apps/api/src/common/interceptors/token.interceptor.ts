import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Session } from '@pawpal/shared';
import { SignTokenUseCase } from '../../modules/auth/application/usecases/sign-token.usecase';

@Injectable()
export class TokenInterceptor implements NestInterceptor {
  constructor(private readonly signTokenUseCase: SignTokenUseCase) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<Session>,
  ): Observable<Session> {
    return next.handle().pipe(
      map((user) => {
        const response = context.switchToHttp().getResponse<Response>();
        const token = this.signTokenUseCase.execute(user);

        response.setHeader('Authorization', `Bearer ${token}`);
        response.cookie('token', token, {
          httpOnly: true,
          signed: true,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production',
        });

        return user;
      }),
    );
  }
}
