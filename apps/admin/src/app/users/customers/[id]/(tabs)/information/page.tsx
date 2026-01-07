"use client";
import UserInfoCard from "@/components/Cards/User/UserInfoCard";
import UserProfileCard from "@/components/Cards/User/UserProfileCard";
import { Box, Grid } from "@pawpal/ui/core";
import { useCustomer } from "../../CustomerContext";

const CustomerInformationPage = () => {
  const { customer } = useCustomer();

  return (
    <Box>
      <Grid>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <UserProfileCard user={customer} type="customer" />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <UserInfoCard user={customer} type="customer" />
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default CustomerInformationPage;
