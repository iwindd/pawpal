"use client";
import ErrorMessage from "@/components/ErrorMessage";
import ActionImage from "@/components/Modals/Auth/components/ActionImage";
import RichText from "@/components/RichText";
import { useAuth } from "@/contexts/AuthContext";
import useFormValidate from "@/hooks/useFormValidate";
import { IconLogin } from "@pawpal/icons";
import { RegisterInput, registerSchema } from "@pawpal/shared";
import {
  Anchor,
  Button,
  Checkbox,
  Divider,
  Group,
  Modal,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@pawpal/ui/core";
import { notify } from "@pawpal/ui/notifications";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function RegisterModal({
  opened,
  onClose,
  onSwitch,
}: Readonly<{
  opened: boolean;
  onClose: () => void;
  onSwitch: () => void;
}>) {
  const { register } = useAuth();
  const __ = useTranslations("Auth.register");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const form = useFormValidate<RegisterInput>({
    schema: registerSchema,
    group: "register",
    mode: "uncontrolled",
    initialValues: {
      displayName: "",
      email: "",
      password: "",
      password_confirmation: "",
      accept_conditions: false,
    },
  });

  const handleSubmit = async (inputs: RegisterInput) => {
    try {
      setLoading(true);
      const state = await register({ inputs: inputs });

      switch (state) {
        case "success":
          onClose();
          notify.show({
            title: __("notify.success.title"),
            message: __("notify.success.message"),
            color: "green",
          });
          break;
        case "email_already_exists":
          form.setErrors({
            email: "email_already_exists",
          });
          break;
        case "error":
          setMessage("error");
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
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
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label={__("displayName")}
              placeholder={__("displayNamePlaceholder")}
              autoComplete="name"
              key={form.key("displayName")}
              {...form.getInputProps("displayName")}
            />

            <TextInput
              label={__("email")}
              placeholder={__("emailPlaceholder")}
              type="email"
              autoComplete="email"
              key={form.key("email")}
              {...form.getInputProps("email")}
            />

            <PasswordInput
              label={__("password")}
              placeholder={__("passwordPlaceholder")}
              autoComplete="new-password"
              key={form.key("password")}
              {...form.getInputProps("password")}
            />

            <PasswordInput
              label={__("confirmPassword")}
              placeholder={__("confirmPasswordPlaceholder")}
              autoComplete="new-password"
              key={form.key("password_confirmation")}
              {...form.getInputProps("password_confirmation")}
            />

            <Stack gap="xs">
              <Checkbox
                label={
                  <RichText>
                    {(tags) => __.rich("termsOfServiceAndPrivacyPolicy", tags)}
                  </RichText>
                }
                key={form.key("accept_conditions")}
                {...form.getInputProps("accept_conditions")}
              />
            </Stack>

            <Button
              type="submit"
              fullWidth
              loading={loading}
              leftSection={<IconLogin />}
            >
              {__("registerButton")}
            </Button>

            <ErrorMessage message={message && `Errors.register.error`} />
            <Divider label={__("label_or")} />

            <Group justify="center" gap="sm">
              <ActionImage iconName="google" label={"google"} />
              <ActionImage iconName="steam" label={"steam"} />
              <ActionImage iconName="apple" label={"apple"} />
            </Group>

            <Group justify="center" gap="xs">
              <Group justify="center" gap="xs">
                <Text size="sm" c="dimmed">
                  {__("hasAccount")}
                </Text>
                <Anchor
                  variant="subtle"
                  size="sm"
                  type="button"
                  onClick={onSwitch}
                >
                  {__("login")}
                </Anchor>
              </Group>
            </Group>
          </Stack>
        </form>
      </Stack>
    </Modal>
  );
}
