"use client";
import PurchaseConfirmationModal from "@/components/Modals/PurchaseConfirmationModal";
import useFormValidate from "@/hooks/useFormValidate";
import {
  defaultPaymentMethod,
  ENUM_DISCOUNT_TYPE,
  paymentMethods,
  ProductResponse,
  PurchaseInput,
  purchaseSchema,
} from "@pawpal/shared";
import {
  Box,
  Button,
  Card,
  ErrorMessage,
  Grid,
  Group,
  Image,
  Radio,
  Stack,
  Text,
  TextInput,
  Title,
} from "@pawpal/ui/core";
import { useDisclosure } from "@pawpal/ui/hooks";
import { useTranslations } from "next-intl";
import NextImage from "next/image";
import { useEffect, useState } from "react";
import AmountIndicator from "./components/AmountIndicator";
import PackageRadio from "./components/PackageRadio";
import PaymentRadio from "./components/PaymentRadio";

interface ProductFormProps {
  product: ProductResponse;
  onPurchase: (values: PurchaseInput) => Promise<void>;
  isLoading: boolean;
}

const ProductForm = ({ product, onPurchase, isLoading }: ProductFormProps) => {
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [showConfirmationModal, { open, close }] = useDisclosure(false);
  const __ = useTranslations("ProductDetail");

  const form = useFormValidate<PurchaseInput>({
    schema: purchaseSchema,
    group: "purchase",
    mode: "controlled",
    initialValues: {
      packageId: "",
      userId: "",
      amount: 1,
      paymentMethod: defaultPaymentMethod,
    },
    onValuesChange: ({ packageId, amount }) => {
      if (!packageId || !product) return;
      const pkg = product.packages.find((p) => p.id === packageId);
      if (!pkg) return;
      const priceWithDiscount = pkg.sale
        ? pkg.price * (1 - pkg.sale.percent / 100)
        : pkg.price;
      setTotalPrice(priceWithDiscount * amount);
    },
  });

  const [submittedValues, setSubmittedValues] = useState<PurchaseInput | null>(
    null
  );

  const handlePurchase = () => {
    onPurchase(submittedValues as PurchaseInput);
    close();
  };

  const selectedPackage = product.packages.find(
    (p) => p.id === submittedValues?.packageId
  );

  useEffect(() => {
    if (product?.packages?.length && product.packages.length > 0) {
      form.setFieldValue("packageId", product.packages[0]?.id || "");
    }
  }, [product]);

  return (
    <>
      <form
        onSubmit={form.onSubmit((values) => {
          setSubmittedValues(values);
          open();
        })}
      >
        <Grid gutter="lg">
          {/* Product Image */}
          <Grid.Col span={{ base: 12 }}>
            <Group>
              <Group>
                <Box h={150} w={150}>
                  <Image
                    component={NextImage}
                    src={`/assets/images/products/${product.slug}`}
                    alt={product.name}
                    height={150}
                    width={150}
                    fit="cover"
                    fallbackSrc="/assets/images/fallback-product.jpg"
                  />
                </Box>
                <Stack gap="xs">
                  <Title order={1}>{product.name}</Title>
                  <Text c="dimmed" size="sm">
                    {product.category.name}
                  </Text>
                </Stack>
              </Group>
              <Group>{/* TODO: Add download platform */}</Group>
            </Group>
          </Grid.Col>

          <Grid.Col span={{ base: 8 }}>
            <Card shadow="sm">
              <Title order={6} mb="md">
                {__("selectPackage")}
              </Title>
              <Radio.Group
                key={form.key("packageId")}
                {...form.getInputProps("packageId")}
              >
                <Grid gutter="sm">
                  {product.packages.map((pkg) => (
                    <Grid.Col span={{ base: 12, md: 6 }} key={pkg.id}>
                      <PackageRadio package={pkg} />
                    </Grid.Col>
                  ))}
                </Grid>
              </Radio.Group>
            </Card>
          </Grid.Col>

          {/* Product Details */}
          <Grid.Col span={{ base: 4 }}>
            <Stack gap="lg">
              {/* Package Selection */}

              {/* User ID Field */}
              <Card shadow="sm">
                <Title order={6} mb="md">
                  {__("gameAccount")}
                </Title>
                <TextInput
                  label={__("userId")}
                  placeholder={__("userIdPlaceholder")}
                  key={form.key("userId")}
                  {...form.getInputProps("userId")}
                />
              </Card>

              {/* Amount indicator */}
              <Card shadow="sm">
                <Group justify="space-between" align="center">
                  <Title order={6}>{__("amount")}</Title>
                  <AmountIndicator form={form} />
                </Group>
                <ErrorMessage
                  align="start"
                  size="xs"
                  formatGroup="Errors.purchase"
                  message={form.errors.amount as string}
                />
              </Card>

              {/* Code Field - TODO: Implement discount code functionality */}
              <Card shadow="sm">
                <Group justify="space-between" align="center">
                  <TextInput
                    placeholder={__("codePlaceholder")}
                    flex={1}
                    m={0}
                  />
                  <Button variant="default" w="fit-content" m={0}>
                    {__("useCode")}
                  </Button>
                </Group>
              </Card>

              {/* Payment Method */}
              <Card shadow="sm">
                <Title order={6} mb="md">
                  {__("paymentMethod")}
                </Title>
                <Radio.Group
                  key={form.key("paymentMethod")}
                  {...form.getInputProps("paymentMethod")}
                >
                  <Stack gap="sm">
                    {paymentMethods.map((method) => (
                      <PaymentRadio
                        key={method.value}
                        data={method}
                        totalPrice={totalPrice}
                      />
                    ))}
                  </Stack>
                </Radio.Group>
              </Card>

              {/* Purchase Button */}
              <Button size="lg" fullWidth type="submit">
                {__("purchase")}
              </Button>
            </Stack>
          </Grid.Col>
        </Grid>
      </form>

      <PurchaseConfirmationModal
        opened={showConfirmationModal}
        onConfirm={handlePurchase}
        onClose={close}
        loading={isLoading}
        title={product.name}
        package={selectedPackage?.name || ""}
        amount={submittedValues?.amount || 0}
        price={(selectedPackage?.price || 0) * (submittedValues?.amount || 0)}
        paymentMethod={submittedValues?.paymentMethod}
        userInfo={submittedValues?.userId}
        sale={
          selectedPackage?.sale && {
            type: ENUM_DISCOUNT_TYPE.PERCENT,
            value: selectedPackage.sale.percent,
          }
        }
      />
    </>
  );
};

export default ProductForm;
