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
import { useEmployee } from "../../EmployeeContext";

const EmployeeInformationPage = () => {
  const { employee } = useEmployee();
  const __ = useTranslations("Employee.profile");

  return (
    <Box py="md">
      <Grid>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder radius="md" p="xl">
            <Stack align="center" gap="sm">
              <Avatar src={employee.avatar} size={120} radius={120} />
              <Title order={3}>{employee.displayName}</Title>
              <Text c="dimmed" size="sm">
                {employee.email}
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
                <Text>{employee.id}</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>{__("email")}</Text>
                <Text>{employee.email}</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>{__("displayName")}</Text>
                <Text>{employee.displayName}</Text>
              </Group>
              <Group justify="space-between">
                <Text fw={500}>{__("roles")}</Text>
                <Group gap="xs">
                  {employee.roles.map((role) => (
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

export default EmployeeInformationPage;
