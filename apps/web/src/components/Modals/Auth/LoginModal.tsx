"use client";
import ActionImage from "@/components/Modals/Auth/components/ActionImage";
import { useAuth } from "@/contexts/AuthContext";
import { IconLogin } from "@pawpal/icons";
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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
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
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput
              label={__("email")}
              placeholder={__("emailPlaceholder")}
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              required
              type="email"
              autoComplete="email"
            />

            <PasswordInput
              label={__("password")}
              placeholder={__("passwordPlaceholder")}
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              required
              autoComplete="current-password"
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
              disabled={!email || !password}
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
