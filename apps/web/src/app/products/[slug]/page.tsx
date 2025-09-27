"use client";

import paymentMethods from "@/configs/payment";
import API from "@/libs/api/client";
import {
  Box,
  Button,
  Card,
  Center,
  Container,
  Grid,
  Group,
  Image,
  Loader,
  Radio,
  Stack,
  Text,
  TextInput,
  Title,
} from "@pawpal/ui/core";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import NextImage from "next/image";
import { use, useEffect, useMemo, useState } from "react";
import AmountIndicator from "./components/AmountIndicator";
import PackageRadio from "./components/PackageRadio";
import PaymentRadio from "./components/PaymentRadio";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({
  params,
}: Readonly<ProductDetailPageProps>) {
  const __ = useTranslations("ProductDetail");
  const resolvedParams = use(params);
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [amount, setAmount] = useState<number>(1);

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", resolvedParams.slug],
    queryFn: async () => {
      const response = await API.product.getProductBySlug(resolvedParams.slug);
      if (!response.success) {
        throw new Error("Failed to fetch product");
      }
      return response.data;
    },
  });

  useEffect(() => {
    if (product?.packages?.length && product.packages.length > 0) {
      setSelectedPackage(product.packages[0]?.id || "");
    }
  }, [product]);

  const totalPriceWithDiscount = useMemo(() => {
    if (!product) return 0;
    const pkg = product.packages.find((p) => p.id === selectedPackage);
    if (!pkg) return 0;
    const priceWithDiscount = pkg.sale
      ? pkg.price * (1 - pkg.sale.percent / 100)
      : pkg.price;

    return priceWithDiscount * amount;
  }, [product, selectedPackage, amount]);

  if (isLoading) {
    return (
      <Container py="xl">
        <Center>
          <Loader size="lg" />
        </Center>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container py="xl">
        <Center>
          <Text>Product not found</Text>
        </Center>
      </Container>
    );
  }

  const handlePurchase = () => {
    if (!selectedPackage || !userId || !paymentMethod) {
      return;
    }
    // Purchase logic will be implemented when payment integration is ready
    console.log({
      product: product.slug,
      package: selectedPackage,
      userId,
      paymentMethod,
      code,
    });
  };

  return (
    <Container py="xl">
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
            <Radio.Group value={selectedPackage} onChange={setSelectedPackage}>
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
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              />
            </Card>

            {/* Amount indicator */}
            <Card shadow="sm">
              <Group justify="space-between" align="center">
                <Title order={6}>{__("amount")}</Title>
                <AmountIndicator amount={amount} setAmount={setAmount} />
              </Group>
            </Card>

            {/* Code Field*/}
            <Card shadow="sm">
              <Group justify="space-between" align="center">
                <TextInput placeholder={__("codePlaceholder")} flex={1} m={0} />
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
              <Radio.Group value={paymentMethod} onChange={setPaymentMethod}>
                <Stack gap="sm">
                  {paymentMethods.map((method) => (
                    <PaymentRadio
                      key={method.value}
                      data={method}
                      totalPrice={totalPriceWithDiscount}
                    />
                  ))}
                </Stack>
              </Radio.Group>
            </Card>

            {/* Purchase Button */}
            <Button
              size="lg"
              fullWidth
              disabled={!selectedPackage || !userId || !paymentMethod}
              onClick={handlePurchase}
            >
              {__("purchase")}
            </Button>
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
