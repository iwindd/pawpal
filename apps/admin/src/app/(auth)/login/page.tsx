"use client";
import { getPath } from "@/configs/route";
import { useLoginMutation } from "@/features/auth/authApi";
import { isErrorWithStatus } from "@/features/helpers";
import { useAppSelector } from "@/hooks";
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
import { useEffect } from "react";
import classes from "./style.module.css";

export default function LoginPage() {
  const [loginMutation, { isLoading, error }] = useLoginMutation();
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  const __ = useTranslations("Auth.login");

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
    const response = await loginMutation(values);

    if (response.error) {
      const message =
        isErrorWithStatus(response.error) && response.error.status;

      if (message == 401) {
        form.setErrors({
          email: "invalid_credentials",
        });
      }

      return;
    }

    notify.show({
      title: __("notify.success.title"),
      message: __("notify.success.message"),
      color: "green",
    });

    router.refresh();
  };

  useEffect(() => {
    if (user) {
      router.push(getPath("home"));
    }
  }, [user]);

  if (user) return null;

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
          loading={isLoading}
          leftSection={<IconLogin />}
          type="submit"
        >
          {__("loginButton")}
        </Button>
        <ErrorMessage
          message={(error && !form.errors && "Errors.login.error") || undefined}
          formatGroup="Errors.login"
        />
      </Paper>
    </Container>
  );
}
