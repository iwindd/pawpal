"use client";
import UserInfoCard from "@/components/Cards/User/UserInfoCard";
import UserProfileCard from "@/components/Cards/User/UserProfileCard";
import { useAppSelector } from "@/hooks";
import { Box, Grid } from "@pawpal/ui/core";

const ProfileInformationPage = () => {
  const session = useAppSelector((state) => state.auth.user)!;

  return (
    <Box py="md">
      <Grid>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <UserProfileCard user={session} type="employee" />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <UserInfoCard user={session} type="employee" />
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default ProfileInformationPage;
