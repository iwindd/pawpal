"use client";
import ChangeEmailModal from "@/components/Modals/User/ChangeEmailModal";
import ChangePasswordModal from "@/components/Modals/User/ChangePasswordModal";
import {
  useAdminResetEmailMutation,
  useAdminResetPasswordMutation,
} from "@/features/user/userApi";
import { Session } from "@pawpal/shared";
import { Anchor, Card, Group, Stack, Text, Title } from "@pawpal/ui/core";
import { useDisclosure } from "@pawpal/ui/hooks";
import { notify } from "@pawpal/ui/notifications";
import { useTranslations } from "next-intl";

interface UserInfoCardProps {
  user: Session;
  type: "customer" | "employee";
}

export default function UserInfoCard({
  user,
  type,
}: Readonly<UserInfoCardProps>) {
  const __ = useTranslations(
    type === "customer" ? "Customer.info" : "Employee.info"
  );

  const [resetEmail, { isLoading: isResettingEmail }] =
    useAdminResetEmailMutation();
  const [resetPassword, { isLoading: isResettingPassword }] =
    useAdminResetPasswordMutation();

  const [emailOpened, { open: openEmail, close: closeEmail }] =
    useDisclosure(false);
  const [passwordOpened, { open: openPassword, close: closePassword }] =
    useDisclosure(false);

  const handleResetEmail = async (values: any) => {
    try {
      await resetEmail({
        id: user.id,
        newEmail: values.newEmail,
        type,
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
        type,
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
    </>
  );
}
