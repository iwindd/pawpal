"use client";
import FilterTopupStatus from "@/components/Select/FilterTopupStatus";
import TopupStatusBadge from "@/components/ฺฺBadges/TopupStatus";
import { useGetTopupHistoryQuery } from "@/features/topup/topupApi";
import { TopupStatus } from "@pawpal/shared";
import {
  Box,
  Card,
  Group,
  Loader,
  Pagination,
  Stack,
  Text,
  TextInput,
  Title,
} from "@pawpal/ui/core";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

const LIMIT_TOPUP = 5;

const TopupHistoryPage = () => {
  const __ = useTranslations("User.Topups");
  const format = useFormatter();
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<TopupStatus | null>(null);

  const { data: topups, isLoading } = useGetTopupHistoryQuery({
    limit: LIMIT_TOPUP,
    page: page,
    filter: filter || undefined,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (!topups) {
    return null;
  }

  return (
    <Stack>
      <Box>
        <Title order={1} size="h2">
          {__("title")}
        </Title>
        <Text c="dimmed" size="sm">
          {__("subtitle")}
        </Text>
      </Box>

      <Group justify="space-between">
        <TextInput placeholder={__("search")} />
        <FilterTopupStatus
          value={filter}
          onChange={(value) => setFilter(value as TopupStatus)}
        />
      </Group>

      {/* Desktop View */}
      <Stack gap="md">
        {topups.data.map((topup) => (
          <Card key={topup.id} shadow="sm" padding="md" radius="md">
            <Stack gap={0}>
              <Group justify="space-between" align="flex-start">
                <Group>
                  <Text fw={500} size="lg">
                    {topup.payment.label}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {format.dateTime(new Date(topup.createdAt), "dateTime")}
                  </Text>
                </Group>
                <TopupStatusBadge status={topup.status} />
              </Group>

              <Group align="center">
                <Text fw={500} size="md" c="blue">
                  {format.number(topup.amount, {
                    style: "currency",
                    currency: "THB",
                  })}
                </Text>
              </Group>
            </Stack>
          </Card>
        ))}
      </Stack>

      <Group justify="space-between">
        <Text c="dimmed">
          {__("page", {
            from: page * LIMIT_TOPUP - LIMIT_TOPUP + 1,
            to: Math.min(page * LIMIT_TOPUP, topups.total),
            total: topups.total,
          })}
        </Text>
        <Pagination
          total={Math.ceil(topups.total / LIMIT_TOPUP)}
          value={page}
          onChange={setPage}
        />
      </Group>
    </Stack>
  );
};

export default TopupHistoryPage;
