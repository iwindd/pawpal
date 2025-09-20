"use client";
import ActionImage from "@/components/Modals/Auth/components/ActionImage";
import { useAuth } from "@/contexts/AuthContext";
import useFormValidate from "@/hooks/useFormValidate";
import { IconLogin } from "@pawpal/icons";
import { LoginInput, loginSchema } from "@pawpal/shared";
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
import { useTranslations } from "next-intl";
import React, { useState } from "react";

export default function LoginModal({
  opened,
  onClose,
  onSwitch,
}: Readonly<{ opened: boolean; onClose: () => void; onSwitch: () => void }>) {
  const { login } = useAuth();
  const __ = useTranslations("Auth.login");
  const [loading, setLoading] = useState(false);

  const form = useFormValidate<LoginInput>({
    schema: loginSchema,
    group: "login",
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
    },
  });

  const [rememberMe, setRememberMe] = useState(false);

  const onSubmit = async (inputs: LoginInput) => {
    setLoading(true);

    try {
      await login({ inputs });
      onClose();
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
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
              label={__("email")}
              placeholder={__("emailPlaceholder")}
              type="text"
              autoComplete="email"
              key={form.key("email")}
              {...form.getInputProps("email")}
            />

            <PasswordInput
              label={__("password")}
              placeholder={__("passwordPlaceholder")}
              autoComplete="current-password"
              key={form.key("password")}
              {...form.getInputProps("password")}
            />

            <Group justify="space-between">
              <Checkbox
                label={__("rememberMe")}
                checked={rememberMe}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setRememberMe(e.currentTarget.checked)
                }
              />
              <Anchor variant="subtle" size="sm" type="button">
                {__("forgotPassword")}
              </Anchor>
            </Group>

            <Button
              type="submit"
              fullWidth
              loading={loading}
              leftSection={<IconLogin />}
            >
              {__("loginButton")}
            </Button>

            <Divider label={__("label_or")} />

            <Group justify="center" gap="sm">
              <ActionImage iconName="google" label={"google"} />
              <ActionImage iconName="steam" label={"steam"} />
              <ActionImage iconName="apple" label={"apple"} />
            </Group>

            <Group justify="center" gap="xs">
              <Text size="sm" c="dimmed">
                {__("noAccount")}
              </Text>
              <Anchor
                variant="subtle"
                size="sm"
                type="button"
                onClick={onSwitch}
              >
                {__("register")}
              </Anchor>
            </Group>
          </Stack>
        </form>
      </Stack>
    </Modal>
  );
}
