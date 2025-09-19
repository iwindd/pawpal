"use client";
import { Card, Container, Group, Stack, Text, Title } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import LoginForm from "../components/LoginForm";
import classes from "./style.module.css";

const Login = () => {
  const __ = useTranslations("Auth.login");

  return (
    <Container size="xl" h="100vh" pb={"xl"}>
      <Group justify="center" mt={"xl"}>
        <Card className={classes.card} shadow="md">
          <Card.Section
            component={Stack}
            gap="md"
            py={"md"}
            inheritPadding
            withBorder
            bg="var(--mantine-primary-color-filled)"
          >
            <Stack gap="xs">
              <Title c="white" order={2}>
                {__("title")}
              </Title>
              <Text c="white" size="sm">
                {__("subtitle")}
              </Text>
            </Stack>
          </Card.Section>
          <Card.Section
            component={Stack}
            gap="md"
            p={"md"}
            inheritPadding
            withBorder
          >
            <LoginForm onLogin={() => {}} isLoading={false} />
          </Card.Section>
        </Card>
      </Group>
    </Container>
  );
};

export default Login;
