"use client";

import paymentMethods, { PaymentMethod } from "@/configs/payment";
import { useAppSelector } from "@/hooks";
import { getPriceWithSale, PricingSale } from "@/utils/pricing";
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
  includeWalletBalance?: boolean;
}

export default function PurchaseConfirmationModal({
  opened,
  onClose,
  onConfirm,
  ...props
}: Readonly<PurchaseConfirmationModalProps>) {
  const format = useFormatter();
  const user = useAppSelector((state) => state.auth.user);
  const __ = useTranslations("PurchaseConfirmation");
  const paymentMethod = paymentMethods.find(
    (p) => p.value === props.paymentMethod
  );

  const price = props.price * props.amount;
  const discountedPrice = props.sale
    ? getPriceWithSale(price, props.sale)
    : price;

  const walletBalance = user?.userWallet.MAIN || 0;
  const includeWallet = props.includeWalletBalance;

  const walletUsed = includeWallet
    ? Math.min(walletBalance, discountedPrice)
    : 0;

  const finalPayable = discountedPrice - walletUsed;
  const totalPrice = Math.max(finalPayable, 0);

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
        {price > totalPrice && (
          <Stack gap="0">
            <Group>
              <Text size="sm">{__("originalPrice")}</Text>
              <Text size="sm" td="line-through" c="dimmed">
                {format.number(price, "currency")}
              </Text>
            </Group>
            {props.includeWalletBalance && (
              <Group>
                <Text size="xs">- {__("includeWalletBalance")}</Text>
                <Text size="xs" c="green">
                  {format.number(walletUsed, "currency")}
                </Text>
              </Group>
            )}
            {props.sale && (
              <Group>
                <Text size="xs">- {__("saleDiscount")}</Text>
                <Text size="xs" c="green">
                  {format.number(discountedPrice, "currency")}
                </Text>
              </Group>
            )}
          </Stack>
        )}

        <Divider />
        {/* Total Price */}
        <Group>
          <Title order={4}>{__("totalPrice")}</Title>
          <Text size="lg" c="green">
            {format.number(totalPrice, "currency")}
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
