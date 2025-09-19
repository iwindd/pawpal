"use client";
import ActionImage from "@/components/Modals/Auth/components/ActionImage";
import RichText from "@/components/RichText";
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
  Title,
} from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import modalClasses from "./modal.module.css";

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
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptConditions, setAcceptConditions] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({
        inputs: {
          displayName,
          email,
          password,
          confirmPassword,
          acceptConditions,
        },
      });
      onClose();
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
      centered
      withCloseButton
      closeOnClickOutside={false}
      closeOnEscape
      trapFocus
      returnFocus
      withinPortal
      zIndex={1000}
      size="md"
      classNames={modalClasses}
      title={
        <Stack gap="xs">
          <Title order={2}>{__("title")}</Title>
          <Text size="sm">{__("subtitle")}</Text>
        </Stack>
      }
    >
      <Stack gap="md">
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput
              label={__("displayName")}
              placeholder={__("displayNamePlaceholder")}
              value={displayName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDisplayName(e.target.value)
              }
              required
              autoComplete="name"
            />

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
              autoComplete="new-password"
            />

            <PasswordInput
              label={__("confirmPassword")}
              placeholder={__("confirmPasswordPlaceholder")}
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setConfirmPassword(e.target.value)
              }
              required
              autoComplete="new-password"
              error={
                password && confirmPassword && password !== confirmPassword
                  ? __("passwordMismatch")
                  : undefined
              }
            />

            <Stack gap="xs">
              <Checkbox
                label={
                  <RichText>
                    {(tags) => __.rich("termsOfServiceAndPrivacyPolicy", tags)}
                  </RichText>
                }
                checked={acceptConditions}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setAcceptConditions(e.currentTarget.checked)
                }
                required
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
