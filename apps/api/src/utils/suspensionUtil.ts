import { UserSuspensionType } from '@/generated/prisma/enums';

export class SuspensionUtil {
  static isSuspended(
    suspensions: {
      type: string;
    }[],
  ) {
    if (!suspensions.length) return false;

    const firstSuspension = suspensions[0];

    return firstSuspension?.type === UserSuspensionType.SUSPENDED;
  }
}
