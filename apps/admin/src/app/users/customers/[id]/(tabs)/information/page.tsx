"use client";
import {
  Avatar,
  Box,
  Card,
  Grid,
  Group,
  Stack,
  Text,
  Title,
} from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import { useCustomer } from "../../CustomerContext";

const CustomerInformationPage = () => {
  const { customer } = useCustomer();
  const __ = useTranslations("Customer.profile");

  return (
    <Box py="md">
      <Grid>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder radius="md" p="xl">
            <Stack align="center" gap="sm">
              <Avatar src={customer.avatar} size={120} radius={120} />
              <Title order={3}>{customer.displayName}</Title>
              <Text c="dimmed" size="sm">
                {customer.email}
              </Text>
            </Stack>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card withBorder radius="md" p="xl">
            <Title order={4} mb="lg">
              {__("accountDetails")}
            </Title>
            <Stack gap="md">
              <Group justify="space-between">
                <Text fw={500}>{__("id")}</Text>
                <Text>{customer.id}</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>{__("email")}</Text>
                <Text>{customer.email}</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>{__("displayName")}</Text>
                <Text>{customer.displayName}</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>{__("roles")}</Text>
                <Group gap="xs">
                  {customer.roles.map((role, index) => (
                    <Text
                      key={role.id}
                      size="sm"
                      px="xs"
                      py={2}
                      style={{ borderRadius: 4 }}
                    >
                      {role.name}
                    </Text>
                  ))}
                </Group>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default CustomerInformationPage;
