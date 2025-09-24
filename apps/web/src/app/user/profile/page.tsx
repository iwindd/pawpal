"use client";
import ErrorMessage from "@/components/ErrorMessage";
import { useAuth } from "@/contexts/AuthContext";
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
import { useRouter } from "next/navigation";
import { useState } from "react";

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const __ = useTranslations("User.Profile");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const form = useFormValidate<UpdateProfileInput>({
    schema: updateProfileSchema,
    group: "updateProfile",
    mode: "uncontrolled",
    initialValues: {
      displayName: user?.displayName || "",
    },
  });

  if (!user) throw new Error("User not found");

  const handleSave = async (inputs: UpdateProfileInput) => {
    setLoading(true);
    try {
      const result = await updateProfile({ inputs });

      if (result === "success") {
        notify.show({
          title: __("notify.success.title"),
          message: __("notify.success.message"),
          color: "green",
        });
        router.push("/user");
      } else {
        setMessage("error");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/user");
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
              src={user.avatar}
              alt={user.displayName}
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
            <Button variant="outline" onClick={handleCancel} disabled={loading}>
              {__("cancel")}
            </Button>
            <Button type="submit" loading={loading}>
              {__("save")}
            </Button>
          </Group>

          <ErrorMessage
            message={message && `Errors.updateProfile.${message}`}
            align="end"
          />
        </form>
      </Card>
    </Stack>
  );
};

export default ProfilePage;
