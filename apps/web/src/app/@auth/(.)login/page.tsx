"use client";
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
import { useRouter } from "next/navigation";
import { useState } from "react";
import ActionImage from "../components/ActionImage";
import modalClasses from "../modal.module.css";

export default function LoginModal() {
  const router = useRouter();
  const { login } = useAuth();
  const __ = useTranslations("Auth.login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    router.back();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      handleClose();
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={true}
      onClose={handleClose}
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
              <RichText>{(tags) => __.rich("noAccount", tags)}</RichText>
            </Group>
          </Stack>
        </form>
      </Stack>
    </Modal>
  );
}
