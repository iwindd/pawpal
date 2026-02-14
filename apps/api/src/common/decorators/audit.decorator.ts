import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Session } from '@pawpal/shared';
import { Request } from 'express';
import { PrismaAuditInfo } from '../interfaces/prisma-audit.interface';

export const AuditInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): PrismaAuditInfo => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as Session;

    return {
      performedById: user ? user.id : undefined,
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
    };
  },
);
