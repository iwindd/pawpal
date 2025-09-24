"use client";
import ChangeEmailModal from "@/components/Modals/Auth/ChangeEmailModal";
import ChangePasswordModal from "@/components/Modals/Auth/ChangePasswordModal";
import { useAuth } from "@/contexts/AuthContext";
import {
  Anchor,
  Avatar,
  Box,
  Card,
  Grid,
  Group,
  Stack,
  Text,
  Title,
} from "@pawpal/ui/core";
import { useFormatter, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

const GridItem = ({
  label,
  value,
  editable,
  onEdit,
}: {
  label: string;
  value: string;
  editable?: boolean;
  onEdit?: () => void;
}) => {
  const __ = useTranslations("User.Account");
  return (
    <>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Text c="dimmed" size="sm">
          {label}
        </Text>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Group>
          <Text c="white" size="sm">
            {value}
          </Text>
          {editable && (
            <Anchor
              size="sm"
              c="dimmed"
              onClick={(e) => {
                e.preventDefault();
                onEdit?.();
              }}
            >
              {__("edit")}
            </Anchor>
          )}
        </Group>
      </Grid.Col>
    </>
  );
};

const AccountPage = () => {
  const { user } = useAuth();
  const __ = useTranslations("User.Account");
  const format = useFormatter();
  const router = useRouter();
  const [changePasswordOpened, setChangePasswordOpened] = useState(false);
  const [changeEmailOpened, setChangeEmailOpened] = useState(false);
  if (!user) throw new Error("User not found");

  const createdAtFormatted = format.dateTime(new Date(user.createdAt), {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
      <Card shadow="sm" padding="xl" radius="md" title={"test"}>
        <Stack gap="lg">
          <Group justify="space-between" align="flex-start">
            <Group gap={"lg"} align="flex-start">
              <Avatar
                src={user.avatar}
                alt={user.displayName}
                size={80}
                radius="xl"
              />
              <Stack gap="0">
                <Title order={3} size="h4">
                  {user.displayName}
                </Title>
                <Text c="dimmed" size="sm">
                  {__("memberSince")} {createdAtFormatted}
                </Text>
                <Grid gutter={0}>
                  <GridItem label={__("id")} value={user.id} />
                  <GridItem
                    label={__("email")}
                    value={user.email}
                    editable
                    onEdit={() => setChangeEmailOpened(true)}
                  />
                  <Grid.Col span={12}>
                    <Anchor
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        setChangePasswordOpened(true);
                      }}
                    >
                      {__("password-change")}
                    </Anchor>

                    <ChangePasswordModal
                      opened={changePasswordOpened}
                      onClose={() => setChangePasswordOpened(false)}
                    />
                  </Grid.Col>
                </Grid>
              </Stack>
            </Group>
            <Anchor
              size="sm"
              c="dimmed"
              onClick={(e) => {
                e.preventDefault();
                router.push("/user/profile");
              }}
            >
              {__("editProfile")}
            </Anchor>
          </Group>
        </Stack>
      </Card>

      <ChangeEmailModal
        opened={changeEmailOpened}
        onClose={() => setChangeEmailOpened(false)}
      />
    </Stack>
  );
};

export default AccountPage;
