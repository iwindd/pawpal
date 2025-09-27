"use client";

import { PaymentData } from "@/configs/payment";
import { ProductPackage, ProductResponse } from "@pawpal/shared";
import {
  Button,
  Divider,
  Group as GroupBase,
  GroupProps,
  Modal,
  Stack,
  Text as TextBase,
  TextProps,
  Title,
} from "@pawpal/ui/core";
import { useFormatter, useTranslations } from "next-intl";
import { useMemo } from "react";

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
  product: ProductResponse;
  selectedPackage: ProductPackage;
  paymentMethod: PaymentData;
  amount: number;
  userId: string;
  loading?: boolean;
}

export default function PurchaseConfirmationModal({
  opened,
  onClose,
  onConfirm,
  product,
  selectedPackage,
  paymentMethod,
  amount,
  userId,
  loading = false,
}: Readonly<PurchaseConfirmationModalProps>) {
  const format = useFormatter();
  const __ = useTranslations("PurchaseConfirmation");

  const pricing = useMemo(() => {
    const originalPrice = selectedPackage.price * amount;
    const discountPercent = selectedPackage.sale?.percent || 0;
    const discountAmount = originalPrice * (discountPercent / 100);
    const finalPrice = originalPrice - discountAmount;
    const isSale = discountAmount > 0;

    return {
      originalPrice,
      discountAmount,
      finalPrice,
      discountPercent,
      isSale,
    };
  }, [selectedPackage, amount]);

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
      title={product.name}
    >
      <Stack gap="xs">
        {/* Product Information */}
        <Group>
          <Text>{__("package")}</Text>
          <Text>{selectedPackage.name}</Text>
        </Group>
        <Group>
          <Text>{__("amount")}</Text>
          <Text>{format.number(amount, "amount")}</Text>
        </Group>

        {/* Payment Method */}
        <Group>
          <Text>{__("paymentMethod")}</Text>
          <Stack>
            <Text>{paymentMethod.label}</Text>
          </Stack>
        </Group>

        {/* Game Account */}
        <Group>
          <Text>{__("gameAccount")}</Text>
          <Stack>
            <Text>{userId}</Text>
          </Stack>
        </Group>

        {/* Pricing Summary */}
        {pricing.isSale && (
          <Stack gap="0">
            <Group>
              <Text size="sm">{__("originalPrice")}</Text>
              <Text size="sm" td="line-through" c="dimmed">
                {format.number(pricing.originalPrice, "currency")}
              </Text>
            </Group>
            <Group>
              <Text size="xs">- {__("saleDiscount")}</Text>
              <Text size="xs" c="green">
                {format.number(pricing.discountAmount, "currency")}
              </Text>
            </Group>
          </Stack>
        )}

        <Divider />
        {/* Total Price */}
        <Group>
          <Title order={4}>{__("totalPrice")}</Title>
          <Text size="lg" c="green">
            {format.number(pricing.finalPrice, "currency")}
          </Text>
        </Group>

        {/* Action Buttons */}
        <Group justify="flex-end" gap="sm" mt="md">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {__("cancel")}
          </Button>
          <Button onClick={onConfirm} loading={loading} disabled={loading}>
            {__("confirm")}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
