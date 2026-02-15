"use client";
import { Group, Paper, Stack, Title } from "@pawpal/ui/core";

interface PageHeaderProps {
  title?: string;
  children?: React.ReactNode;
}

const PageHeader = ({ title, children }: PageHeaderProps) => {
  return (
    <Paper bg="transparent">
      <Group pb={"md"} justify="space-between">
        <Stack gap="0">
          <Group>
            <Title order={3}>{title}</Title>
          </Group>
        </Stack>
        {children}
      </Group>
    </Paper>
  );
};

export default PageHeader;
