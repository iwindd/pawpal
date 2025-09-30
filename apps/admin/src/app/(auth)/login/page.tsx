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
  Group,
  Paper,
  PasswordInput,
  TextInput,
  Title,
} from "@pawpal/ui/core";
import { notify } from "@pawpal/ui/notifications";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import classes from "./style.module.css";

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
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

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const onSubmit = async (values: LoginInput) => {
    setLoading(true);

    try {
      const state = await login({ inputs: values });

      switch (state) {
        case "success":
          notify.show({
            title: __("notify.success.title"),
            message: __("notify.success.message"),
            color: "green",
          });
          router.push("/");
          break;
        case "invalid_credentials":
          form.setFieldError("email", "invalid_credentials");
          break;
        case "error":
          notify.show({
            title: __("errors.login.error"),
            message: __("errors.login.error"),
            color: "red",
          });
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
      </Paper>
    </Container>
  );
}
