"use client";
import ErrorMessage from "@/components/ErrorMessage";
import useFormValidate from "@/hooks/useFormValidate";
import { IconKey } from "@pawpal/icons";
import { ChangePasswordInput, changePasswordSchema } from "@pawpal/shared";
import { Button, Group, Modal, PasswordInput, Stack } from "@pawpal/ui/core";
import { notify } from "@pawpal/ui/notifications";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function ChangePasswordModal({
  opened,
  onClose,
}: Readonly<{ opened: boolean; onClose: () => void }>) {
  const __ = useTranslations("Auth.changePassword");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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
    setLoading(true);
    setMessage(null);

    try {
      // Mock API call - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate success for now
      const success = true;

      if (success) {
        onClose();
        form.reset();
        notify.show({
          title: __("notify.success.title"),
          message: __("notify.success.message"),
          color: "green",
        });
      } else {
        setMessage("error");
      }
    } catch (error) {
      console.error("Change password error:", error);
      setMessage("error");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    setMessage(null);
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
                disabled={loading}
              >
                {__("cancelButton")}
              </Button>
              <Button
                type="submit"
                loading={loading}
                leftSection={<IconKey size={16} />}
              >
                {__("changeButton")}
              </Button>
            </Group>

            <ErrorMessage message={message} />
          </Stack>
        </form>
      </Stack>
    </Modal>
  );
}
