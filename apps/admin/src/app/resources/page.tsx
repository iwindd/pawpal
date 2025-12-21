"use client";
import OverlayImage from "@/components/Images/OverlayImage/OverlayImage";
import ViewResouceImageModal from "@/components/Modals/ViewResourceImageModal";
import ResourceImage from "@/components/ResourceImage";
import { useGetInfiniteResourcesInfiniteQuery } from "@/features/resource/resourceApi";
import useUploadImage from "@/hooks/useUploadImage";
import { AdminResourceResponse } from "@pawpal/shared";
import {
  Box,
  Button,
  Center,
  DataTableSortStatus,
  Divider,
  Grid,
  Group,
  Paper,
  Select,
  Stack,
  Text,
  Title,
} from "@pawpal/ui/core";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const RESOURCE_SORT_BY: {
  value: DataTableSortStatus<AdminResourceResponse>;
  label: string;
}[] = [
  {
    value: { columnAccessor: "createdAt", direction: "desc" },
    label: "sortBy.options.newest",
  },
  {
    value: { columnAccessor: "createdAt", direction: "asc" },
    label: "sortBy.options.oldest",
  },
];

const ResourcePage = () => {
  const __ = useTranslations("Resources");
  const uploadImage = useUploadImage();
  const formmater = useFormatter();
  const [records, setRecords] = useState<AdminResourceResponse[]>([]);
  const [viewRecord, setViewRecord] = useState<number | null>(null);
  const [sort, setSort] = useState<DataTableSortStatus<AdminResourceResponse>>(
    RESOURCE_SORT_BY[0]!.value
  );

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetInfiniteResourcesInfiniteQuery({
      limit: 18,
      sort: JSON.stringify(sort),
    });

  useEffect(() => {
    if (data) {
      setRecords(data?.pages.flatMap((page) => page.data ?? []) ?? []);
    }
  }, [data]);

  const onSelectSort = (value: string | null) => {
    const index = Number(value || 0);
    const sort = RESOURCE_SORT_BY[index];
    if (sort) {
      setSort(sort.value);
    }
  };

  return (
    <div>
      <Group justify="space-between" align="end">
        <Stack gap="0">
          <Group>
            <Title order={2}>{__("title")}</Title>
            <Button size="xs" variant="outline" onClick={uploadImage.open}>
              {__("upload")}
            </Button>
          </Group>
          <Text size="sm" c="dimmed">
            {__("subtitle")}
          </Text>
        </Stack>
        <Group gap="xs">
          <Select
            label={__("sortBy.label")}
            data={RESOURCE_SORT_BY.map((item, index) => ({
              value: index.toString(),
              label: __(item.label),
            }))}
            onChange={onSelectSort}
            clearable={false}
            defaultValue={"0"}
          />
        </Group>
      </Group>

      <Divider my="xs" />
      <Paper p={5} pt={0} bg="transparent">
        <Grid gutter={"xs"}>
          {records.length > 0 &&
            records.map((resource, index) => (
              <Grid.Col
                key={resource.id}
                p={1}
                span={{
                  xs: 6,
                  sm: 4,
                  md: 3,
                  lg: 2,
                }}
              >
                <OverlayImage
                  onClick={() => setViewRecord(index)}
                  image={
                    <Box
                      style={{
                        aspectRatio: "1 / 1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                      }}
                    >
                      <ResourceImage
                        src={resource.url}
                        width={500}
                        height={500}
                        alt={resource.url}
                        style={{
                          width: "100%",
                          height: "100%", // CSS overrides the intrinsic height prop, maintaining aspect ratio
                        }}
                      />
                    </Box>
                  }
                >
                  <Stack w="100%" h="100%" justify="end">
                    <Stack gap={0} mb={"xs"}>
                      <Text>{resource.id}</Text>
                      <Text size="xs" c="dimmed" truncate>
                        {formmater.dateTime(
                          new Date(resource.createdAt),
                          "dateTime"
                        )}
                        {__("resource.uploadedBy", {
                          name: resource.user.displayName,
                        })}
                      </Text>
                    </Stack>
                  </Stack>
                </OverlayImage>
              </Grid.Col>
            ))}
        </Grid>
        {hasNextPage && (
          <Center>
            <Button
              size="xs"
              mt={"sm"}
              variant="outline"
              onClick={() => fetchNextPage()}
              loading={isFetchingNextPage}
            >
              {__("loadMore")}
            </Button>
          </Center>
        )}
      </Paper>

      <ViewResouceImageModal
        resource={
          viewRecord == null || records[viewRecord] == null
            ? null
            : records[viewRecord]
        }
        close={() => setViewRecord(null)}
        hasNext={viewRecord !== records.length - 1 || hasNextPage}
        hasPrev={viewRecord !== 0}
        next={async () => {
          const nextIndex = viewRecord! + 1;
          if (nextIndex === records.length) {
            await fetchNextPage();
            setTimeout(() => {
              setViewRecord(nextIndex);
            }, 100);
          } else {
            setViewRecord(nextIndex);
          }
        }}
        prev={() => setViewRecord(viewRecord! - 1)}
      />
      {uploadImage.input}
    </div>
  );
};

export default ResourcePage;
