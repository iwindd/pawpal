import { PrismaService } from '@/modules/prisma/prisma.service';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionEnum } from '@pawpal/shared';
import { Request } from 'express';
import {
  NormalizedPermissions,
  PERMISSIONS_KEY,
} from '../decorators/permissions.decorator';
import { WithUser } from '../decorators/user.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Merge metadata from both handler and class (handler takes precedence)
    const required = this.reflector.getAllAndOverride<
      NormalizedPermissions | undefined
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    // No @Permissions() decorator → public (within auth scope)
    if (!required) return true;

    const request = context.switchToHttp().getRequest<WithUser<Request>>();

    const user = request.user;

    if (!user) throw new ForbiddenException('no_user_in_request');

    // Query the user's permissions fresh from the database
    const userWithRoles = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: {
        roles: {
          select: {
            permissions: {
              select: { name: true },
            },
          },
        },
      },
    });

    if (!userWithRoles) throw new ForbiddenException('user_not_found');

    // Flatten and deduplicate permission names
    const userPermissions = new Set(
      userWithRoles.roles.flatMap((role) =>
        role.permissions.map((p) => p.name),
      ),
    );

    // Wildcard bypass: if the user has "*.*" they can do anything
    if (userPermissions.has(PermissionEnum.Wildcard)) return true;

    // Check ALL: every permission in `all` must be present
    const hasAll = required.all.every((p) => userPermissions.has(p));

    if (!hasAll) throw new ForbiddenException('insufficient_permissions');

    // Check ANY: if any array is non-empty, at least one must match
    if (required.any.length > 0) {
      const hasAny = required.any.some((p) => userPermissions.has(p));

      if (!hasAny) throw new ForbiddenException('insufficient_permissions');
    }

    return true;
  }
}
