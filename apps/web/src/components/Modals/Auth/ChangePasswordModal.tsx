"use client";
import ErrorMessage from "@/components/ErrorMessage";
import { useChangePasswordMutation } from "@/features/auth/authApi";
import { isErrorWithData, isErrorWithMessage } from "@/features/helpers";
import useFormValidate from "@/hooks/useFormValidate";
import { IconKey } from "@pawpal/icons";
import { ChangePasswordInput, changePasswordSchema } from "@pawpal/shared";
import { Button, Group, Modal, PasswordInput, Stack } from "@pawpal/ui/core";
import { notify } from "@pawpal/ui/notifications";
import { useTranslations } from "next-intl";

export default function ChangePasswordModal({
  opened,
  onClose,
}: Readonly<{ opened: boolean; onClose: () => void }>) {
  const __ = useTranslations("Auth.changePassword");
  const [changePasswordMutation, { isLoading, error }] =
    useChangePasswordMutation();

  const form = useFormValidate<ChangePasswordInput>({
    schema: changePasswordSchema,
    group: "changePassword",
    mode: "uncontrolled",
    initialValues: {
      oldPassword: "",
      newPassword: "",
      newPasswordConfirmation: "",
    },
  });

  const onSubmit = async (inputs: ChangePasswordInput) => {
    const response = await changePasswordMutation(inputs);

    if (response.error) {
      const message =
        isErrorWithData(response.error) &&
        isErrorWithMessage(response.error.data) &&
        response.error.data.message;

      if (message == "invalid_old_password") {
        form.setErrors({
          oldPassword: "invalid_old_password",
        });
      }

      return;
    }

    onClose();
    form.reset();
    notify.show({
      title: __("notify.success.title"),
      message: __("notify.success.message"),
      color: "green",
    });
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      withCloseButton
      closeOnClickOutside={false}
      closeOnEscape
      trapFocus
      returnFocus
      withinPortal
      zIndex={1000}
      size="md"
      title={__("title")}
    >
      <Stack gap="md">
        <form onSubmit={form.onSubmit(onSubmit)}>
          <Stack gap="md">
            <PasswordInput
              label={__("oldPassword")}
              placeholder={__("oldPasswordPlaceholder")}
              autoComplete="current-password"
              key={form.key("oldPassword")}
              {...form.getInputProps("oldPassword")}
            />

            <PasswordInput
              label={__("newPassword")}
              placeholder={__("newPasswordPlaceholder")}
              autoComplete="new-password"
              key={form.key("newPassword")}
              {...form.getInputProps("newPassword")}
            />

            <PasswordInput
              label={__("newPasswordConfirmation")}
              placeholder={__("newPasswordConfirmationPlaceholder")}
              autoComplete="new-password"
              key={form.key("newPasswordConfirmation")}
              {...form.getInputProps("newPasswordConfirmation")}
            />

            <Group justify="flex-end" gap="sm" mt="md">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                {__("cancelButton")}
              </Button>
              <Button
                type="submit"
                loading={isLoading}
                leftSection={<IconKey size={16} />}
              >
                {__("changeButton")}
              </Button>
            </Group>

            <ErrorMessage
              message={error && `Errors.changePassword.error`}
              align="end"
            />
          </Stack>
        </form>
      </Stack>
    </Modal>
  );
}
