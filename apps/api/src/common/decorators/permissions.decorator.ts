import { SetMetadata } from '@nestjs/common';
import { PermissionEnum } from '@pawpal/shared';

/**
 * The shape after normalization.
 * - `all`: every one of these permissions is required
 * - `any`: at least one of these permissions is required
 */
export interface NormalizedPermissions {
  all: PermissionEnum[];
  any: PermissionEnum[];
}

/**
 * Raw input accepted by the `@Permissions()` decorator.
 *
 * Single:             @Permissions(PermissionEnum.EmployeeManagement)
 * All (array):        @Permissions([PermissionEnum.EmployeeManagement, PermissionEnum.CustomerManagement])
 * Advanced (object):  @Permissions({ all: [...], any: [...] })
 */
export type PermissionsInput =
  | PermissionEnum
  | PermissionEnum[]
  | { all?: PermissionEnum[]; any?: PermissionEnum[] };

export const PERMISSIONS_KEY = 'permissions';

/**
 * Normalize any `PermissionsInput` variant into the canonical shape.
 */
export function normalizePermissions(
  input: PermissionsInput,
): NormalizedPermissions {
  // Single enum value → require that single permission
  if (typeof input === 'string') {
    return { all: [input], any: [] };
  }

  // Array → require ALL permissions in the array
  if (Array.isArray(input)) {
    return { all: input, any: [] };
  }

  // Object with all / any
  return {
    all: input.all ?? [],
    any: input.any ?? [],
  };
}

/**
 * Decorator that marks a route handler with the required permissions.
 *
 * @example
 * // Require a single permission
 * @Permissions(PermissionEnum.EmployeeManagement)
 *
 * // Require ALL permissions (AND)
 * @Permissions([PermissionEnum.EmployeeManagement, PermissionEnum.CustomerManagement])
 *
 * // Advanced: require ALL of `all` AND at least one of `any`
 * @Permissions({
 *   all: [PermissionEnum.CustomerManagement],
 *   any: [PermissionEnum.CategoryManagement, PermissionEnum.TagManagement],
 * })
 */
export const Permissions = (input: PermissionsInput) =>
  SetMetadata(PERMISSIONS_KEY, normalizePermissions(input));
