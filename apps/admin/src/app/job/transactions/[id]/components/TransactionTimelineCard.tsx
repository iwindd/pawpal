"use client";
import {
  IconCheck,
  IconClockHour4,
  IconReceiptDollarFilled,
  IconUserFilled,
  IconX,
} from "@pawpal/icons";
import { ENUM_TRANSACTION_STATUS } from "@pawpal/shared";
import { Card, Group, Text, Timeline } from "@pawpal/ui/core";
import { useFormatter, useNow, useTranslations } from "next-intl";
import { useTransaction } from "../TransactionContext";

const TransactionTimelineCard = () => {
  const { transaction } = useTransaction();
  const __ = useTranslations("Transaction.timeline");
  const format = useFormatter();
  const now = useNow();

  // Determine active step based on transaction data
  let activeStep = 1;

  if (transaction.confirmedAt) activeStep = 2;

  // step 2 check if assigned
  if (transaction.assignedAt && transaction.confirmedAt) activeStep = 3;

  // step 3 check if decided (SUCCEEDED / FAILED)
  if (
    transaction.status === ENUM_TRANSACTION_STATUS.SUCCEEDED ||
    transaction.status === ENUM_TRANSACTION_STATUS.FAILED
  )
    activeStep = 4;

  return (
    <Card>
      <Card.Header title={__("title")} />
      <Card.Content>
        <Timeline active={activeStep} color={"secondary"}>
          {/* Step 1: Created */}
          <Timeline.Item
            bullet={<IconReceiptDollarFilled size={12} />}
            title={__("createOrder")}
          >
            <Text c="dimmed" size="sm">
              {__("createOrderDesc", {
                name: transaction.customer?.displayName,
              })}
            </Text>
            {transaction.createdAt && (
              <Text size="xs" mt={4}>
                {format.relativeTime(new Date(transaction.createdAt!), now)}
              </Text>
            )}
          </Timeline.Item>

          {/* Step 2: Confirmation / Payment */}
          <Timeline.Item
            bullet={<IconCheck size={12} />}
            title={__("confirmTransfer")}
          >
            {transaction.confirmedAt ? (
              <>
                <Text c="dimmed" size="xs">
                  {__("confirmTransferDesc", {
                    name: transaction.customer?.displayName,
                  })}
                </Text>
                <Text size="xs" mt={4}>
                  {format.relativeTime(new Date(transaction.confirmedAt!), now)}
                </Text>
              </>
            ) : (
              <Text c="dimmed" size="xs">
                {__("unconfirmedTransferDesc", {
                  name: transaction.customer?.displayName,
                })}
              </Text>
            )}
          </Timeline.Item>

          {/* Step 3: Assigned / Take Case */}
          <Timeline.Item
            title={__("takeCase")}
            bullet={<IconUserFilled size={12} />}
            lineVariant="dashed"
          >
            {transaction.assignedAt ? (
              <>
                <Text c="dimmed" size="xs">
                  {__("takeCaseDesc", {
                    name: transaction.assigned?.displayName,
                  })}
                </Text>
                <Text size="xs" mt={4}>
                  {format.relativeTime(new Date(transaction.assignedAt!), now)}
                </Text>
              </>
            ) : (
              <Text c="dimmed" size="xs">
                {__("untakenCaseDesc")}
              </Text>
            )}
          </Timeline.Item>

          {/* Step 4: Check */}
          <Timeline.Item title={__("checking")}>
            <Text c="dimmed" size="xs">
              {__("checkingDesc")}
            </Text>
          </Timeline.Item>

          {/* Step 5: Approved/Rejected */}
          <Timeline.Item
            title={__("approveOrReject")}
            bullet={
              transaction.status === ENUM_TRANSACTION_STATUS.SUCCEEDED ? (
                <IconCheck size={12} />
              ) : transaction.status === ENUM_TRANSACTION_STATUS.FAILED ? (
                <IconX size={12} />
              ) : (
                <IconClockHour4 size={12} />
              )
            }
            color={
              transaction.status === ENUM_TRANSACTION_STATUS.SUCCEEDED
                ? "green"
                : transaction.status === ENUM_TRANSACTION_STATUS.FAILED
                  ? "red"
                  : "secondary"
            }
          >
            {transaction.succeededAt || transaction.failedAt ? (
              <Text c="dimmed" size="xs">
                {format.dateTime(
                  new Date((transaction.succeededAt || transaction.failedAt)!),
                  "dateTime",
                )}
              </Text>
            ) : (
              <Text c="dimmed" size="xs">
                {__("waitingForAction")}
              </Text>
            )}

            {transaction.status === "SUCCEEDED" ? (
              <Group gap="xs" mt={4}>
                <IconCheck
                  color="var(--mantine-color-green-filled)"
                  size={14}
                />
                <Text size="xs" c="dimmed">
                  {__("approvedBy", {
                    name: transaction.succeededBy?.displayName || "",
                  })}
                </Text>
              </Group>
            ) : transaction.status === "FAILED" ? (
              <Group gap="xs" mt={4}>
                <IconX color="var(--mantine-color-red-filled)" size={14} />
                <Text size="xs" c="dimmed">
                  {__("rejectedBy", {
                    name: transaction.failedBy?.displayName || "",
                  })}
                </Text>
              </Group>
            ) : (
              <Group gap="xs" mt={4}>
                <IconClockHour4 color="var(--mantine-color-dimmed)" size={14} />
                <Text size="xs" c="dimmed">
                  {__("lastStep")}
                </Text>
              </Group>
            )}
          </Timeline.Item>
        </Timeline>
      </Card.Content>
    </Card>
  );
};

export default TransactionTimelineCard;
