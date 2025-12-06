import { useAppSelector } from "@/hooks";
import usePaymentGateway from "@/hooks/usePaymentGateway";
import { getPriceWithSale } from "@/utils/pricing";
import { ENUM_DISCOUNT_TYPE, ProductPackage } from "@pawpal/shared";
import {
  Box,
  Card,
  Checkbox,
  Group,
  Image,
  Radio,
  Stack,
  Text,
  Title,
} from "@pawpal/ui/core";
import { UseFormReturnType } from "@pawpal/ui/form";
import { useFormatter, useTranslations } from "next-intl";
import NextImage from "next/image";
import { PurchaseFormInput } from "../..";
import classes from "./style.module.css";

interface PaymentPartialProp {
  form: UseFormReturnType<PurchaseFormInput>;
  selectedPackage?: ProductPackage;
}

const PaymentPartial = ({ form, selectedPackage }: PaymentPartialProp) => {
  const __ = useTranslations("ProductDetail");
  const format = useFormatter();
  const { data } = usePaymentGateway();
  const user = useAppSelector((state) => state.auth.user);
  const basePrice = selectedPackage?.price || 0;
  const amount = form.getValues().amount;
  const price = basePrice * amount;
  const discountedPrice = getPriceWithSale(price, {
    type: ENUM_DISCOUNT_TYPE.PERCENT,
    value: selectedPackage?.sale?.percent || 0,
  });

  const walletBalance = user?.userWallet.MAIN || 0;
  const includeWallet = form.getValues().includeWalletBalance;

  const walletUsed = includeWallet
    ? Math.min(walletBalance, discountedPrice)
    : 0;

  const finalPayable = discountedPrice - walletUsed;

  const totalPrice = Math.max(finalPayable, 0);

  return (
    <Card shadow="sm">
      <Title order={6} mb="md">
        {__("paymentMethod")}
      </Title>
      <Radio.Group
        key={form.key("paymentMethod")}
        {...form.getInputProps("paymentMethod")}
      >
        <Stack gap="sm">
          {data?.map((gateway) => {
            return (
              <Radio.Card
                className={classes.root}
                radius="md"
                value={gateway.id}
                key={gateway.id}
              >
                <Group
                  wrap="nowrap"
                  align="center"
                  justify="space-between"
                  w="100%"
                  gap="xs"
                >
                  <Group>
                    <Box w={50} h={50}>
                      <Image
                        component={NextImage}
                        src={`/assets/images/fallback-product.jpg`}
                        alt={gateway.label}
                        width={50}
                        height={50}
                      />
                    </Box>
                  </Group>
                  <Stack gap={0} flex={1} style={{ overflow: "hidden" }}>
                    <Title order={5} className={classes.label}>
                      {gateway.label}
                    </Title>
                    {gateway.text ? (
                      <Text size="xs" truncate>
                        {gateway.text}
                      </Text>
                    ) : null}
                  </Stack>
                  <Stack gap={0} align="flex-end">
                    <Text size="sm" inline>
                      {format.number(totalPrice, "currency")}
                    </Text>
                    {price > totalPrice && (
                      <Text size="xs" c="dimmed" td="line-through" inline>
                        {format.number(price, "currency")}
                      </Text>
                    )}
                  </Stack>
                </Group>
              </Radio.Card>
            );
          })}
        </Stack>
      </Radio.Group>
      <Checkbox
        mt={"md"}
        label={__("includeWalletBalance")}
        description={__("includeWalletBalanceDescription", {
          amount: includeWallet
            ? format.number(walletBalance - walletUsed, "currency")
            : format.number(walletBalance, "currency"),
          discount: includeWallet
            ? `(-${format.number(walletUsed, "currency")})`
            : "",
        })}
        key={form.key("includeWalletBalance")}
        {...form.getInputProps("includeWalletBalance", { type: "checkbox" })}
      />
    </Card>
  );
};

export default PaymentPartial;
