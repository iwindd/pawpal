"use client";
import ActionImage from "@/app/@auth/components/ActionImage";
import RichText from "@/components/RichText";
import { IconLogin } from "@pawpal/icons";
import {
  Anchor,
  Button,
  Checkbox,
  Divider,
  Group,
  PasswordInput,
  Stack,
  TextInput,
} from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

const LoginForm = ({
  onLogin,
  isLoading,
}: {
  onLogin: (email: string, password: string) => void;
  isLoading: boolean;
}) => {
  const __ = useTranslations("Auth.login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
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
          loading={isLoading}
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
  );
};

export default LoginForm;
