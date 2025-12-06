"use client";
import ErrorMessage from "@/components/ErrorMessage";
import { useUpdateProfileMutation } from "@/features/auth/authApi";
import { useAppSelector } from "@/hooks";
import useFormValidate from "@/hooks/useFormValidate";
import { UpdateProfileInput, updateProfileSchema } from "@pawpal/shared";
import {
  Avatar,
  Box,
  Button,
  Card,
  FileInput,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
} from "@pawpal/ui/core";
import { notify } from "@pawpal/ui/notifications";
import { useTranslations } from "next-intl";
import { useState } from "react";

const ProfilePage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [updateProfileMutation, { error }] = useUpdateProfileMutation();
  const __ = useTranslations("User.Profile");
  const [loading, setLoading] = useState(false);

  const form = useFormValidate<UpdateProfileInput>({
    schema: updateProfileSchema,
    group: "updateProfile",
    mode: "uncontrolled",
    initialValues: {
      displayName: user?.displayName ?? "",
    },
  });

  const handleSave = async (inputs: UpdateProfileInput) => {
    const response = await updateProfileMutation(inputs);
    if (response.error) return;

    notify.show({
      title: __("notify.success.title"),
      message: __("notify.success.message"),
      color: "green",
    });
  };

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
        <form onSubmit={form.onSubmit(handleSave)}>
          <Group gap="lg" align="flex-start">
            <Avatar
              src={user?.avatar}
              alt={user?.displayName}
              size={80}
              radius="xl"
            />
            <Stack gap="md" style={{ flex: 1 }}>
              <TextInput
                label={__("displayName")}
                key={form.key("displayName")}
                {...form.getInputProps("displayName")}
              />
              <FileInput
                label={__("avatar")}
                placeholder={__("avatarPlaceholder")}
                description={__("avatarDescription")}
                disabled
              />
            </Stack>
          </Group>

          <Group justify="flex-end" gap="sm" mt="md">
            <Button type="submit" loading={loading}>
              {__("save")}
            </Button>
          </Group>

          <ErrorMessage
            message={error && `Errors.updateProfile.error`}
            align="end"
          />
        </form>
      </Card>
    </Stack>
  );
};

export default ProfilePage;
