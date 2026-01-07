export const USER_SUSPENSION_TYPE = {
  SUSPENDED: "SUSPENDED",
  UNSUSPENDED: "UNSUSPENDED",
};

export type UserSuspensionType = keyof typeof USER_SUSPENSION_TYPE;
