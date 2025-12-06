"use client";
import ErrorMessage from "@/components/ErrorMessage";
import { useChangeEmailMutation } from "@/features/auth/authApi";
import { isErrorWithData, isErrorWithMessage } from "@/features/helpers";
import useFormValidate from "@/hooks/useFormValidate";
import { IconSettings } from "@pawpal/icons";
import { ChangeEmailInput, changeEmailSchema } from "@pawpal/shared";
import {
  Button,
  Group,
  Modal,
  PasswordInput,
  Stack,
  TextInput,
} from "@pawpal/ui/core";
import { notify } from "@pawpal/ui/notifications";
import { useTranslations } from "next-intl";

export default function ChangeEmailModal({
  opened,
  onClose,
}: Readonly<{ opened: boolean; onClose: () => void }>) {
  const __ = useTranslations("Auth.changeEmail");
  const [changeEmailMutation, { isLoading, error }] = useChangeEmailMutation();

  const form = useFormValidate<ChangeEmailInput>({
    schema: changeEmailSchema,
    group: "changeEmail",
    mode: "uncontrolled",
    initialValues: {
      newEmail: "",
      password: "",
    },
  });

  const onSubmit = async (inputs: ChangeEmailInput) => {
    const response = await changeEmailMutation(inputs);

    if (response.error) {
      const data = isErrorWithData(response.error) && response.error.data;
      const message = isErrorWithMessage(data) && data.message;

      switch (message) {
        case "invalid_password":
          form.setErrors({
            password: "invalid_password",
          });
          break;
        case "email_already_exists":
          form.setErrors({
            newEmail: "email_already_exists",
          });
          break;
        default:
          break;
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
            <TextInput
              label={__("newEmail")}
              placeholder={__("newEmailPlaceholder")}
              type="email"
              autoComplete="email"
              key={form.key("newEmail")}
              {...form.getInputProps("newEmail")}
            />

            <PasswordInput
              label={__("password")}
              placeholder={__("passwordPlaceholder")}
              autoComplete="current-password"
              key={form.key("password")}
              {...form.getInputProps("password")}
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
                leftSection={<IconSettings size={16} />}
              >
                {__("changeButton")}
              </Button>
            </Group>

            <ErrorMessage
              message={error && `Errors.changeEmail.error`}
              align="end"
            />
          </Stack>
        </form>
      </Stack>
    </Modal>
  );
}
