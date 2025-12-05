"use client";
import UploadImageModal from "@/components/Modals/UploadImageModal";
import ResourceImage from "@/components/ResourceImage";
import { useGetResourcesQuery } from "@/services/resource";
import {
  Box,
  Button,
  Divider,
  Grid,
  Group,
  Paper,
  Select,
  Stack,
  Text,
  Title,
} from "@pawpal/ui/core";
import { useDisclosure } from "@pawpal/ui/hooks";
import { useTranslations } from "next-intl";

const COL_SPAN = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 5,
};

const ResourcePage = () => {
  const __ = useTranslations("Resources");
  const [opened, { open, close }] = useDisclosure(false);

  const { data, isLoading } = useGetResourcesQuery({
    page: 1,
    limit: 1000, // TODO:: implement pagination
  });

  return (
    <div>
      <Group justify="space-between" align="end">
        <Stack gap="0">
          <Group>
            <Title order={2}>{__("title")}</Title>
            <Button size="xs" variant="outline" onClick={open}>
              {__("upload")}
            </Button>
          </Group>
          <Text size="sm" c="dimmed">
            {__("subtitle")}
          </Text>
        </Stack>
        <Group gap="xs">
          <Select placeholder={__("sortBy")} disabled data={[]} />
          <Select placeholder={__("fileType")} disabled data={[]} />
          <Select placeholder={__("uploadedBy")} disabled data={[]} />
        </Group>
      </Group>

      <Divider my="xs" />
      <Paper p={5}>
        <Grid gutter={"xs"}>
          {!isLoading &&
            data?.data.map((resource) => (
              <Grid.Col key={resource.id} span={COL_SPAN.xs} p={1}>
                <Box>
                  <ResourceImage
                    src={resource.url}
                    width={128}
                    height={128}
                    alt={resource.url}
                  />
                </Box>
              </Grid.Col>
            ))}
        </Grid>
      </Paper>

      <UploadImageModal opened={opened} onClose={close} />
    </div>
  );
};

export default ResourcePage;
