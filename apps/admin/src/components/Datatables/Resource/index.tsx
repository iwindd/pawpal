import ResourceImage from "@/components/ResourceImage";
import { useGetInfiniteResourcesInfiniteQuery } from "@/features/resource/resourceApi";
import { AdminResourceResponse } from "@pawpal/shared";
import {
  Box,
  Center,
  Loader,
  LoadingTrigger,
  ScrollArea,
  Table,
  Text,
} from "@pawpal/ui/core";
import { useFormatter, useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

interface ResourceDatatableProps {
  onSelectedRecordsChange?: (selectedRecords: AdminResourceResponse[]) => void;
}

const ResourceDatatable = ({
  onSelectedRecordsChange,
}: ResourceDatatableProps) => {
  const format = useFormatter();
  const __ = useTranslations("Datatable.product");
  const [records, setRecords] = useState<AdminResourceResponse[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<
    AdminResourceResponse[]
  >([]);
  const [selectedLimit] = useState(1);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetInfiniteResourcesInfiniteQuery({});

  const loadMoreRecords = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    if (data) {
      setRecords(data?.pages.flatMap((page) => page.data ?? []) ?? []);
    }
  }, [data]);

  const onSelectRecord = useCallback(
    (newRecordId: AdminResourceResponse["id"]) => {
      setSelectedRecords((prev) => {
        const newRecord = records.find((record) => record.id === newRecordId);
        if (!newRecord) return prev;

        // REMOVE
        if (prev.some((record) => record.id === newRecordId)) {
          return prev.filter((record) => record.id !== newRecordId);
        }

        // ADD
        if (prev.length < selectedLimit) {
          return [...prev, newRecord];
        }

        // REPLACE
        return [...prev.slice(1), newRecord];
      });
    },
    [records, selectedLimit]
  );

  useEffect(() => {
    onSelectedRecordsChange?.(selectedRecords);
  }, [selectedRecords, onSelectedRecordsChange]);

  if (isLoading) {
    return (
      <Center h="100%" w="100%">
        <Loader size="sm" />
      </Center>
    );
  }

  return (
    <Box h="100%" w="100%">
      <ScrollArea h="450" type="scroll">
        <Table highlightOnHover miw={700}>
          <Table.Tbody>
            {records.map((record) => (
              <Table.Tr
                key={record.id + record.url}
                bg={
                  (selectedRecords.some(
                    (selectedRecord) => selectedRecord.id === record.id
                  ) &&
                    "grey") ||
                  undefined
                }
                onClick={() => onSelectRecord(record.id)}
                style={{
                  cursor: "pointer",
                }}
              >
                <Table.Td>
                  <Box h={50} w={50} pos="relative">
                    <ResourceImage fill alt={record.url} src={record.url} />
                  </Box>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">
                    {record.id} -{record.url}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">
                    {format.dateTime(new Date(record.createdAt), "date")}
                  </Text>
                </Table.Td>
              </Table.Tr>
            ))}
            <Table.Tr display={hasNextPage ? "table-row" : "none"}>
              <Table.Td colSpan={3}>
                <LoadingTrigger
                  onLoadMore={loadMoreRecords}
                  hasNextPage={hasNextPage}
                  isFetchingNextPage={isFetchingNextPage}
                  h="20"
                  w="100%"
                >
                  <Center>
                    <Loader size="sm" />
                  </Center>
                </LoadingTrigger>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Box>
  );
};

export default ResourceDatatable;
