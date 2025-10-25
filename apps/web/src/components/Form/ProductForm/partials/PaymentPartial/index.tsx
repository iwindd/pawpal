import usePaymentGateway from "@/hooks/usePaymentGateway";
import { getDiscountedPrice } from "@/utils/productUtils";
import { ProductPackage } from "@pawpal/shared";
import {
  Box,
  Card,
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
  const { data } = usePaymentGateway();
  const format = useFormatter();

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
                    <div>
                      <Title order={5} className={classes.label}>
                        {gateway.label}
                      </Title>
                      <Text size="xs" className={classes.description}>
                        {gateway.text}
                      </Text>
                    </div>
                  </Group>
                  <Stack gap={0} align="flex-end">
                    <Text size="sm" inline>
                      {format.number(
                        getDiscountedPrice(
                          selectedPackage?.price || 0,
                          selectedPackage?.sale
                        ),
                        "currency"
                      )}
                    </Text>
                    {selectedPackage?.sale && (
                      <Text size="xs" c="dimmed" td="line-through" inline>
                        {format.number(selectedPackage?.price || 0, "currency")}
                      </Text>
                    )}
                  </Stack>
                </Group>
              </Radio.Card>
            );
          })}
        </Stack>
      </Radio.Group>
    </Card>
  );
};

export default PaymentPartial;
