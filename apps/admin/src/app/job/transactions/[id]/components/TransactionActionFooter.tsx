"use client";
import { useTransactionActions } from "@/hooks/useTransactionActions";
import { IconCheck, IconInfoCircle, IconX } from "@pawpal/icons";
import { Button, Group, Paper, Text } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import { useTransaction } from "../TransactionContext";

const TransactionActionFooter = () => {
  const { transaction } = useTransaction();
  const __ = useTranslations("Transaction");
  const { successJobTransaction, failJobTransaction, isLoading } =
    useTransactionActions();

  // Show only if status is PENDING or CREATED, adjust as necessary based on requirements
  if (transaction.status === "SUCCEEDED" || transaction.status === "FAILED") {
    return null;
  }

  const handleApprove = () => {
    successJobTransaction(transaction.id);
  };

  const handleReject = () => {
    failJobTransaction(transaction.id);
  };

  return (
    <Paper
      p="md"
      shadow="md"
      w="100%"
      style={{
        position: "sticky",
        bottom: 0,
        zIndex: 10,
      }}
      radius={0}
    >
      <Group justify="space-between">
        <Group>
          <IconInfoCircle size={18} color="var(--mantine-color-dimmed)" />
          <Text size="sm" c="dimmed">
            {__("footer.warningText")}
          </Text>
        </Group>
        <Group>
          <Button
            variant="light"
            color="red"
            leftSection={<IconX size={16} />}
            onClick={handleReject}
            loading={isLoading}
          >
            {__("footer.reject")}
          </Button>
          <Button
            variant="filled"
            color="green"
            leftSection={<IconCheck size={16} />}
            onClick={handleApprove}
            loading={isLoading}
          >
            {__("footer.approve")}
          </Button>
        </Group>
      </Group>
    </Paper>
  );
};

export default TransactionActionFooter;
