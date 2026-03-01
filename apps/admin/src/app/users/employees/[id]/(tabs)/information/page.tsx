"use client";
import UserInfoCard from "@/components/Cards/User/UserInfoCard";
import UserProfileCard from "@/components/Cards/User/UserProfileCard";
import { Grid } from "@pawpal/ui/core";
import { useEmployee } from "../../EmployeeContext";

const EmployeeInformationPage = () => {
  const { employee } = useEmployee();

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 4 }}>
        <UserProfileCard user={employee} type="employee" />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 8 }}>
        <UserInfoCard user={employee} type="employee" />
      </Grid.Col>
    </Grid>
  );
};

export default EmployeeInformationPage;
