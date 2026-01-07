"use client";
import UpdateProfileModal from "@/components/Modals/User/UpdateProfileModal";
import TextWithCaption from "@/components/TextWithCaption";
import { useUpdateUserProfileMutation } from "@/features/user/userApi";
import { UserResponse } from "@pawpal/shared";
import { Anchor, Avatar, Card, Stack } from "@pawpal/ui/core";
import { notify } from "@pawpal/ui/notifications";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

interface UserProfileCardProps {
  user: UserResponse;
  type: "customer" | "employee";
}

export default function UserProfileCard({
  user,
  type,
}: Readonly<UserProfileCardProps>) {
  const __ = useTranslations(
    type === "customer" ? "Customer.profile" : "Employee.profile"
  );
  const format = useFormatter();

  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateUserProfileMutation();

  const [profileOpened, setProfileOpened] = useState(false);

  const handleUpdateProfile = async (values: any) => {
    try {
      await updateProfile({
        id: user.id,
        profile: values,
        type,
      }).unwrap();
      notify.show({
        message: __("notify.updateProfileSuccess"),
        color: "green",
      });
      setProfileOpened(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Stack gap="md" h={"100%"}>
        <Card withBorder radius="md" h={"100%"}>
          <Stack align="center" gap={0}>
            <Avatar src={user.avatar} size={120} radius={120} mb={"lg"} />
            <TextWithCaption
              order={2}
              text={user.displayName}
              caption={__("createdAt", {
                date: format.dateTime(new Date(user.createdAt), "date"),
              })}
            />
            <Anchor
              variant="transparent"
              size="xs"
              onClick={() => setProfileOpened(true)}
            >
              {__("editProfile")}
            </Anchor>
          </Stack>
        </Card>
      </Stack>

      <UpdateProfileModal
        opened={profileOpened}
        onClose={() => setProfileOpened(false)}
        initialValues={{ displayName: user.displayName }}
        onSubmit={handleUpdateProfile}
        loading={isUpdatingProfile}
      />
    </>
  );
}
