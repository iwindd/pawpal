"use client";
import ActionImage from "@/app/@auth/components/ActionImage";
import RichText from "@/components/RichText";
import { RegisterProps } from "@/contexts/AuthContext";
import { IconLogin } from "@pawpal/icons";
import {
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

const RegisterForm = ({
  onRegister,
  isLoading,
}: {
  onRegister: (props: RegisterProps["inputs"]) => void;
  isLoading: boolean;
}) => {
  const __ = useTranslations("Auth.register");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptConditions, setAcceptConditions] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister({
      displayName,
      email,
      password,
      confirmPassword,
      acceptConditions,
    });
  };

  return (
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
          loading={isLoading}
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
            <RichText>{(tags) => __.rich("hasAccount", tags)}</RichText>
          </Group>
        </Group>
      </Stack>
    </form>
  );
};

export default RegisterForm;
