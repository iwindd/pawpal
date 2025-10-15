"use client";

import paymentMethods, { PaymentMethod } from "@/configs/payment";
import {
  getDiscountValue,
  getPriceWithSale,
  PricingSale,
} from "@/libs/pricing";
import {
  Button,
  Divider,
  Group as GroupBase,
  GroupProps,
  Modal,
  Stack,
  Table,
  Text as TextBase,
  TextProps,
  Title,
} from "@pawpal/ui/core";
import { useFormatter, useTranslations } from "next-intl";

const Text = (props: TextProps & { children: React.ReactNode }) => {
  return <TextBase inline size="sm" c="dimmed" {...props} />;
};

const Group = (props: GroupProps & { children: React.ReactNode }) => {
  return <GroupBase justify="space-between" {...props} />;
};

interface PurchaseConfirmationModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  title: string;
  package: string;
  amount: number;
  price: number;
  fields: Record<string, any>[];
  paymentMethod?: PaymentMethod;
  sale?: PricingSale;
}

export default function PurchaseConfirmationModal({
  opened,
  onClose,
  onConfirm,
  ...props
}: Readonly<PurchaseConfirmationModalProps>) {
  const format = useFormatter();
  const __ = useTranslations("PurchaseConfirmation");
  const paymentMethod = paymentMethods.find(
    (p) => p.value === props.paymentMethod
  );

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton
      closeOnClickOutside={false}
      closeOnEscape
      trapFocus
      returnFocus
      withinPortal
      zIndex={1000}
      size="md"
      title={props.title}
    >
      <Stack gap="xs">
        {/* Product Information */}
        <Group>
          <Text>{__("package")}</Text>
          <Text>{props.package}</Text>
        </Group>
        <Group>
          <Text>{__("amount")}</Text>
          <Text>{format.number(props.amount, "amount")}</Text>
        </Group>

        {/* Payment Method */}
        {paymentMethod && (
          <Group>
            <Text>{__("paymentMethod")}</Text>
            <Stack>
              <Text>{paymentMethod.label}</Text>
            </Stack>
          </Group>
        )}

        {/* Game Account */}
        {props.fields && (
          <Stack align="start" gap={0}>
            <Text>{__("gameAccount")}</Text>
            <Table withRowBorders={false} p={0} verticalSpacing={0}>
              <Table.Tbody p={0}>
                {props.fields.map((field, index) => (
                  <Table.Tr key={field.label + index}>
                    <Table.Td p={0}>
                      <Text>- {field.label}</Text>
                    </Table.Td>
                    <Table.Td p={0} align="right">
                      <Text>{field.value}</Text>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Stack>
        )}

        {/* Pricing Summary */}
        {props.sale && (
          <Stack gap="0">
            <Group>
              <Text size="sm">{__("originalPrice")}</Text>
              <Text size="sm" td="line-through" c="dimmed">
                {format.number(props.price, "currency")}
              </Text>
            </Group>
            <Group>
              <Text size="xs">- {__("saleDiscount")}</Text>
              <Text size="xs" c="green">
                {format.number(
                  getDiscountValue(props.price, props.sale),
                  "currency"
                )}
              </Text>
            </Group>
          </Stack>
        )}

        <Divider />
        {/* Total Price */}
        <Group>
          <Title order={4}>{__("totalPrice")}</Title>
          <Text size="lg" c="green">
            {format.number(
              (props.sale && getPriceWithSale(props.price, props.sale)) ||
                props.price,
              "currency"
            )}
          </Text>
        </Group>

        {/* Action Buttons */}
        <Group justify="flex-end" gap="sm" mt="md">
          <Button variant="outline" onClick={onClose} disabled={props.loading}>
            {__("cancel")}
          </Button>
          <Button
            onClick={onConfirm}
            loading={props.loading}
            disabled={props.loading}
          >
            {__("confirm")}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
