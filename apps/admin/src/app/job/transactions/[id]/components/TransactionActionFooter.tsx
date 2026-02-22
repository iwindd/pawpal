"use client";
import { useAppSelector } from "@/hooks";
import { IconCheck, IconInfoCircle, IconX } from "@pawpal/icons";
import { Button, Group, Paper, Skeleton, Text } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import { useTransaction } from "../TransactionContext";

const TransactionActionFooter = () => {
  const user = useAppSelector((state) => state.auth.user);
  const { transaction, actions, isLoading } = useTransaction();
  const __ = useTranslations("Transaction");

  if (isLoading) {
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
          <Skeleton height={20} width={200} />
          <Group>
            <Skeleton height={36} width={100} />
            <Skeleton height={36} width={100} />
          </Group>
        </Group>
      </Paper>
    );
  }

  // Show only if status is PENDING or CREATED, adjust as necessary based on requirements
  if (transaction.status === "SUCCEEDED" || transaction.status === "FAILED") {
    return null;
  }

  // Not owner of the case
  if (transaction.assigned?.id !== user?.id) {
    return null;
  }

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
            onClick={actions.fail}
            loading={isLoading}
          >
            {__("footer.reject")}
          </Button>
          <Button
            variant="filled"
            color="green"
            leftSection={<IconCheck size={16} />}
            onClick={actions.success}
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
