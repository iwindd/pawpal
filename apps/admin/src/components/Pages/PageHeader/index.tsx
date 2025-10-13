import AppBreadcrumbs from "@/components/AppBreadcrumbs";
import { Group, Paper, Stack, Title } from "@pawpal/ui/core";

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  withBreadcrumbs?: boolean;
  children?: React.ReactNode;
}

const PageHeader = ({
  title,
  subtitle,
  withBreadcrumbs = true,
  children,
}: PageHeaderProps) => {
  return (
    <Paper bg="transparent">
      <Group pb={"md"} justify="space-between">
        <Stack gap="0">
          <Group>
            <Title order={2}>{title}</Title>
          </Group>
          {withBreadcrumbs && <AppBreadcrumbs />}
        </Stack>
        {children}
      </Group>
    </Paper>
  );
};

export default PageHeader;
