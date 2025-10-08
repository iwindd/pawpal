import ResourceImage from '@/components/ResourceImage';
import API from "@/libs/api/client";
import {
  Box,
  Center,
  Loader,
  LoadingTrigger,
  ScrollArea,
  Table,
  Text,
} from "@pawpal/ui/core";
import {useInfiniteQuery} from "@tanstack/react-query";
import {useFormatter, useTranslations} from "next-intl";
import {useCallback, useEffect, useState} from "react";

interface ResourceDatatableProps {
  onSelectedRecordsChange?: (selectedRecords: any[]) => void;
}

const ResourceDatatable = ({ onSelectedRecordsChange }: ResourceDatatableProps) => {
  const format = useFormatter();
  const __ = useTranslations("Datatable.product");
  const [records, setRecords] = useState<any[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<any[]>([]);
  const [selectedLimit] = useState(1);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["resources"],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await API.resource.list({
          page: pageParam,
          limit: 12,
        });
        return res; 
      },
      getNextPageParam: (lastPage, allPages) => {
        const total = lastPage.data.total;
        const loaded = allPages.flatMap(p => p.data.data).length;

        return loaded < total ? allPages.length + 1 : undefined;
      },
      initialPageParam: 1,
    });

  const loadMoreRecords = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const onSelectRecord = useCallback((recordId: any) => { 
    setSelectedRecords((prev) => {
      if (prev.includes(recordId)) {
        return prev.filter((id) => id !== recordId);
      }

      if (prev.length < selectedLimit) {
        return [...prev, recordId];
      }

      if (prev.length >= selectedLimit) {
        const newSelected = prev.slice(1);
        newSelected.push(recordId);
        return newSelected;
      }

      return prev;
    })
  }, [selectedRecords]);

  useEffect(() => {
    if (data) {
      setRecords(
        data?.pages.flatMap((page) => page.data.data ?? []) ?? []
      );
    }
  }, [data]);

  useEffect(() => {
    if (onSelectedRecordsChange) {
      const resources = records.filter(r => selectedRecords.includes(r.id));
      onSelectedRecordsChange(resources);
    }
  }, [selectedRecords, records]);

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
        <Table
          highlightOnHover
          miw={700}
        >
          <Table.Tbody>
            {records.map((record) => (
              <Table.Tr
                key={record.id}
                bg={(selectedRecords.includes(record.id) && "grey") || undefined}
                onClick={() => onSelectRecord(record.id)}
                style={{
                  cursor: "pointer",
                }}

              >
                <Table.Td>
                  <Box h={50} w={50} pos="relative">
                    <ResourceImage
                      fill
                      alt={record.url}
                      src={record.url}
                    />
                  </Box>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{record.url}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{format.dateTime(new Date(record.createdAt), "date")}</Text>
                </Table.Td>
              </Table.Tr>
            ))}
            <Table.Tr
              display={hasNextPage ? "table-row" : "none"}
            >
              <Table.Td
                colSpan={3}>
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
