import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import { Session } from '@pawpal/shared';

export const AuthUser = createParamDecorator(
  (data: keyof Session, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest<Request>().user as Session;

    return data ? user?.[data] : user;
  },
);
