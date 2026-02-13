"use client";
import UserSuspendedBadge from "@/components/Badges/UserSuspendedBadge";
import ChangeEmailModal from "@/components/Modals/User/ChangeEmailModal";
import ChangePasswordModal from "@/components/Modals/User/ChangePasswordModal";
import SuspendUserModal from "@/components/Modals/User/SuspendUserModal";
import {
  useAdminResetEmailMutation,
  useAdminResetPasswordMutation,
  useSuspendUserMutation,
  useUnsuspendUserMutation,
} from "@/features/user/userApi";
import { Session } from "@pawpal/shared";
import { Anchor, Card, Group, Stack, Text, Title } from "@pawpal/ui/core";
import { useDisclosure } from "@pawpal/ui/hooks";
import { notify } from "@pawpal/ui/notifications";
import { useTranslations } from "next-intl";

interface UserInfoCardProps {
  user: Session;
  type: "customer" | "employee" | "session";
}

export default function UserInfoCard({
  user,
  type,
}: Readonly<UserInfoCardProps>) {
  const __ = useTranslations(
    type === "employee" || type === "session"
      ? "Employee.info"
      : "Customer.info",
  );

  const [resetEmail, { isLoading: isResettingEmail }] =
    useAdminResetEmailMutation();
  const [resetPassword, { isLoading: isResettingPassword }] =
    useAdminResetPasswordMutation();
  const [suspendUser, { isLoading: isSuspending }] = useSuspendUserMutation();
  const [unsuspendUser, { isLoading: isUnsuspending }] =
    useUnsuspendUserMutation();

  const [emailOpened, { open: openEmail, close: closeEmail }] =
    useDisclosure(false);
  const [passwordOpened, { open: openPassword, close: closePassword }] =
    useDisclosure(false);
  const [suspendOpened, { open: openSuspend, close: closeSuspend }] =
    useDisclosure(false);
  const [unsuspendOpened, { open: openUnsuspend, close: closeUnsuspend }] =
    useDisclosure(false);

  const handleResetEmail = async (values: any) => {
    try {
      await resetEmail({
        id: user.id,
        newEmail: values.newEmail,
        type: type === "session" ? "customer" : type,
      }).unwrap();
      notify.show({
        message: __("notify.resetEmailSuccess"),
        color: "green",
      });
      closeEmail();
    } catch (error) {
      console.error(error);
    }
  };

  const handleResetPassword = async (values: any) => {
    try {
      await resetPassword({
        id: user.id,
        newPassword: values.newPassword,
        type: type === "session" ? "customer" : type,
      }).unwrap();
      notify.show({
        message: __("notify.resetPasswordSuccess"),
        color: "green",
      });
      closePassword();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSuspend = async (values: { note?: string }) => {
    try {
      await suspendUser({
        id: user.id,
        type: type === "session" ? "customer" : type,
        note: values.note,
      }).unwrap();
      notify.show({
        message: __("notify.suspendSuccess"),
        color: "green",
      });
      closeSuspend();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnsuspend = async (values: { note?: string }) => {
    try {
      await unsuspendUser({
        id: user.id,
        type: type === "session" ? "customer" : type,
        note: values.note,
      }).unwrap();
      notify.show({
        message: __("notify.unsuspendSuccess"),
        color: "green",
      });
      closeUnsuspend();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Card withBorder radius="md" h={"100%"}>
        <Title order={5} mb="lg">
          {__("accountDetails")}
        </Title>
        <Stack gap={"xs"}>
          <Group justify="space-between">
            <Text size="sm" fw={500}>
              {__("id")}
            </Text>
            <Text size="sm">{user.id}</Text>
          </Group>
          <Group justify="space-between">
            <Text size="sm" fw={500}>
              {__("email")}
            </Text>
            <Group gap="xs">
              <Text size="sm">{user.email}</Text>
              <Anchor size="xs" onClick={openEmail}>
                {__("editEmail")}
              </Anchor>
            </Group>
          </Group>
          <Group justify="space-between">
            <Text size="sm" fw={500}>
              {__("roles")}
            </Text>
            <Group gap="xs">
              {user.roles.map((role: any) => (
                <Text key={role.id} size="sm" style={{ borderRadius: 4 }}>
                  {role.name}
                </Text>
              ))}
            </Group>
          </Group>
          <Group justify="space-between">
            <Text size="sm" fw={500}>
              {__("suspension")}
            </Text>
            <Group gap="xs">
              <UserSuspendedBadge isSuspended={user.isSuspended} />
              {type != "session" &&
                (user.isSuspended ? (
                  <Anchor size="xs" onClick={openUnsuspend}>
                    {__("unsuspendAction")}
                  </Anchor>
                ) : (
                  <Anchor size="xs" onClick={openSuspend}>
                    {__("suspendAction")}
                  </Anchor>
                ))}
            </Group>
          </Group>
          <Group justify="space-between">
            <Anchor size="xs" onClick={openPassword}>
              {__("editPassword")}
            </Anchor>
          </Group>
        </Stack>
      </Card>
      <ChangeEmailModal
        opened={emailOpened}
        onClose={closeEmail}
        initialValues={{ newEmail: user.email }}
        onSubmit={handleResetEmail}
        loading={isResettingEmail}
      />

      <ChangePasswordModal
        opened={passwordOpened}
        onClose={closePassword}
        onSubmit={handleResetPassword}
        loading={isResettingPassword}
      />

      <SuspendUserModal
        opened={suspendOpened}
        onClose={closeSuspend}
        onSubmit={handleSuspend}
        loading={isSuspending}
        type="suspend"
      />

      <SuspendUserModal
        opened={unsuspendOpened}
        onClose={closeUnsuspend}
        onSubmit={handleUnsuspend}
        loading={isUnsuspending}
        type="unsuspend"
      />
    </>
  );
}
