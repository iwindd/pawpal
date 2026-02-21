"use client";
import { useTransactionActions } from "@/hooks/useTransactionActions";
import { IconInfoCircle, IconUserBolt, IconUserSearch } from "@pawpal/icons";
import {
  Box,
  Button,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
} from "@pawpal/ui/core";
import { useFormatter, useTranslations } from "next-intl";
import { useTransaction } from "../TransactionContext";

const TransactionAssignedCard = () => {
  const format = useFormatter();
  const __ = useTranslations("Transaction");
  const { transaction } = useTransaction();
  const { assignJobTransaction, isLoading } = useTransactionActions();

  const handleAssign = () => {
    assignJobTransaction(transaction.id);
  };

  if (transaction.assigned) {
    return (
      <Paper p="md" bg="var(--mantine-color-secondary-light)">
        <Group justify="space-between" align="center">
          <Group gap="md">
            <ThemeIcon
              color="var(--mantine-color-secondary-light)"
              size="xl"
              radius="xl"
            >
              <IconUserSearch
                size={24}
                color="var(--mantine-color-secondary-light-color)"
              />
            </ThemeIcon>
            <Stack gap={0}>
              <Text fw={700} c="var(--mantine-color-secondary-light-color)">
                {__("assignedCard.assignedTo", {
                  name: transaction.assigned?.displayName,
                })}
              </Text>
              {transaction.assignedAt && (
                <Text size="sm">
                  {__("assignedCard.assignedAt")}{" "}
                  {format.dateTime(
                    new Date(transaction.assignedAt),
                    "dateTime",
                  )}
                </Text>
              )}
            </Stack>
          </Group>
        </Group>
      </Paper>
    );
  }

  return (
    <Paper p="md" bg="var(--mantine-color-warning-light)">
      <Group justify="space-between">
        <Group>
          <IconInfoCircle color="var(--mantine-color-warning-light-color)" />
          <Text c="var(--mantine-color-warning-light-color)">
            {__("assignedCard.notAssigned")}
          </Text>
        </Group>
        <Box>
          <Button
            leftSection={<IconUserBolt size={14} />}
            variant="filled"
            color="warning"
            onClick={handleAssign}
            loading={isLoading}
          >
            {__("detail.takeCase")}
          </Button>
        </Box>
      </Group>
    </Paper>
  );
};

export default TransactionAssignedCard;
