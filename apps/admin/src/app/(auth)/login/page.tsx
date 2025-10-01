"use client";
import { useAuth } from "@/contexts/AuthContext";
import useFormValidate from "@/hooks/useFormValidate";
import { IconLogin } from "@pawpal/icons";
import { LoginInput, loginSchema } from "@pawpal/shared";
import {
  Anchor,
  Button,
  Checkbox,
  Container,
  ErrorMessage,
  Group,
  Paper,
  PasswordInput,
  TextInput,
  Title,
} from "@pawpal/ui/core";
import { notify } from "@pawpal/ui/notifications";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import classes from "./style.module.css";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const __ = useTranslations("Auth.login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useFormValidate<LoginInput>({
    schema: loginSchema,
    group: "login",
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginInput) => {
    setLoading(true);
    setError(null);

    try {
      const state = await login({ inputs: values });

      switch (state) {
        case "success":
          notify.show({
            title: __("notify.success.title"),
            message: __("notify.success.message"),
            color: "green",
          });
          router.refresh();
          break;
        case "invalid_credentials":
          form.setFieldError("email", "invalid_credentials");
          break;
        case "error":
          setError("error");
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
      notify.show({
        title: __("errors.login.error"),
        message: __("errors.login.error"),
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        {__("title")}
      </Title>

      <Paper
        withBorder
        component="form"
        onSubmit={form.onSubmit(onSubmit)}
        shadow="sm"
        p={22}
        mt={30}
        radius="md"
      >
        <TextInput
          label={__("email")}
          placeholder={__("emailPlaceholder")}
          autoComplete="email"
          radius="md"
          key={form.key("email")}
          {...form.getInputProps("email")}
        />
        <PasswordInput
          label={__("password")}
          placeholder={__("passwordPlaceholder")}
          autoComplete="current-password"
          mt="md"
          radius="md"
          key={form.key("password")}
          {...form.getInputProps("password")}
        />
        <Group justify="space-between" mt="lg">
          <Checkbox label={__("rememberMe")} />
          <Anchor component="button" size="sm">
            {__("forgotPassword")}
          </Anchor>
        </Group>
        <Button
          fullWidth
          mt="xl"
          radius="md"
          loading={loading}
          leftSection={<IconLogin />}
          type="submit"
        >
          {__("loginButton")}
        </Button>
        <ErrorMessage message={error} formatGroup="Errors.login" />
      </Paper>
    </Container>
  );
}
