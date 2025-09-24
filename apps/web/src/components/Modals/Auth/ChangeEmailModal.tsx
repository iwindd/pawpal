"use client";
import ErrorMessage from "@/components/ErrorMessage";
import { useAuth } from "@/contexts/AuthContext";
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
import { useState } from "react";

export default function ChangeEmailModal({
  opened,
  onClose,
}: Readonly<{ opened: boolean; onClose: () => void }>) {
  const __ = useTranslations("Auth.changeEmail");
  const { changeEmail: changeEmailApi } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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
    setLoading(true);
    setMessage(null);

    try {
      const result = await changeEmailApi({ inputs });

      if (result === "success") {
        onClose();
        form.reset();
        notify.show({
          title: __("notify.success.title"),
          message: __("notify.success.message"),
          color: "green",
        });
      } else if (result === "invalid_password") {
        form.setErrors({
          password: "invalid_password",
        });
      } else if (result === "email_already_exists") {
        form.setErrors({
          newEmail: "email_already_exists",
        });
      } else {
        setMessage("error");
      }
    } catch (error) {
      console.error("Change email error:", error);
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
                disabled={loading}
              >
                {__("cancelButton")}
              </Button>
              <Button
                type="submit"
                loading={loading}
                leftSection={<IconSettings size={16} />}
              >
                {__("changeButton")}
              </Button>
            </Group>

            <ErrorMessage
              message={message && `Errors.changeEmail.${message}`}
              align="end"
            />
          </Stack>
        </form>
      </Stack>
    </Modal>
  );
}
