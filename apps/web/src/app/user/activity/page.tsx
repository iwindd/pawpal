"use client";
import {
  IconActivity,
  IconCheck,
  IconHistory,
  IconLogin,
  IconSettings,
} from "@pawpal/icons";
import {
  Box,
  Card,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@pawpal/ui/core";
import { useFormatter, useTranslations } from "next-intl";

const ActivityPage = () => {
  const __ = useTranslations("User.Activity");
  const format = useFormatter();

  // Mock activity data
  const activities = [
    {
      id: 1,
      type: "login",
      title: __("activities.login"),
      description: __("activities.loginDesc"),
      date: new Date("2024-01-20T10:30:00"),
      icon: IconLogin,
      color: "blue",
    },
    {
      id: 2,
      type: "purchase",
      title: __("activities.purchase"),
      description: __("activities.purchaseDesc", { orderId: "ORD-001" }),
      date: new Date("2024-01-15T14:22:00"),
      icon: IconHistory,
      color: "green",
    },
    {
      id: 3,
      type: "review",
      title: __("activities.review"),
      description: __("activities.reviewDesc", { product: "Premium Dog Food" }),
      date: new Date("2024-01-12T16:45:00"),
      icon: IconActivity,
      color: "yellow",
    },
    {
      id: 4,
      type: "profile",
      title: __("activities.profile"),
      description: __("activities.profileDesc"),
      date: new Date("2024-01-10T09:15:00"),
      icon: IconSettings,
      color: "purple",
    },
    {
      id: 5,
      type: "purchase",
      title: __("activities.purchase"),
      description: __("activities.purchaseDesc", { orderId: "ORD-002" }),
      date: new Date("2024-01-08T11:30:00"),
      icon: IconHistory,
      color: "green",
    },
    {
      id: 6,
      type: "login",
      title: __("activities.login"),
      description: __("activities.loginDesc"),
      date: new Date("2024-01-05T08:20:00"),
      icon: IconLogin,
      color: "blue",
    },
    {
      id: 7,
      type: "order_complete",
      title: __("activities.orderComplete"),
      description: __("activities.orderCompleteDesc", { orderId: "ORD-001" }),
      date: new Date("2024-01-03T15:10:00"),
      icon: IconCheck,
      color: "green",
    },
    {
      id: 8,
      type: "profile",
      title: __("activities.profile"),
      description: __("activities.profileDesc"),
      date: new Date("2023-12-28T13:25:00"),
      icon: IconSettings,
      color: "purple",
    },
  ];

  return (
    <Stack gap="xl">
      <Box>
        <Title order={1} size="h2">
          {__("title")}
        </Title>
        <Text c="dimmed" size="sm">
          {__("subtitle")}
        </Text>
      </Box>

      <Card shadow="sm" padding="xl" radius="md">
        <Stack gap="md">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <Paper key={activity.id} p="md" style={{ position: "relative" }}>
                <Group align="flex-start" gap="md">
                  <ThemeIcon
                    color={activity.color}
                    size="lg"
                    radius="xl"
                    style={{
                      position: "relative",
                      zIndex: 2,
                    }}
                  >
                    <Icon size={16} />
                  </ThemeIcon>
                  <Box style={{ flex: 1 }}>
                    <Group>
                      <Text fw={500} size="sm" mb={4}>
                        {activity.title}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {format.dateTime(activity.date, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    </Group>
                    <Text c="dimmed" size="sm" mb={4}>
                      {activity.description}
                    </Text>
                  </Box>
                </Group>
              </Paper>
            );
          })}
        </Stack>
      </Card>
    </Stack>
  );
};

export default ActivityPage;
