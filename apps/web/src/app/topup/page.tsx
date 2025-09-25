"use client";
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  NumberInput,
  Radio,
  Stack,
  Text,
  Title,
} from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import { useState } from "react";
import RadioMethod from "./components/RadioMethod";

const TopupPage = () => {
  const __ = useTranslations("Topup");
  const [amount, setAmount] = useState<number | "">("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  const handleTopup = () => {
    if (!amount || !paymentMethod) return;

    // Here you would handle the topup logic
    console.log("Topup amount:", amount, "Payment method:", paymentMethod);
  };

  return (
    <Container py="xl">
      <Card shadow="sm" padding="lg" mb="sm">
        <Title order={1} size="h2" mb="xs">
          {__("title")}
        </Title>
        <Text c="dimmed" size="sm">
          {__("subtitle")}
        </Text>
      </Card>
      <Grid gutter="sm">
        <Grid.Col span={{ base: 12, md: 8 }} order={{ base: 2, md: 1 }}>
          <Stack gap="sm">
            {/* Additional Info */}
            <Card shadow="sm" padding="lg">
              <Text size="sm" fw={500} mb="md">
                {__("paymentMethod")}
              </Text>
              <Stack gap="sm">
                <Radio.Group value={paymentMethod} onChange={setPaymentMethod}>
                  <Stack pt="md" gap="xs">
                    <RadioMethod
                      label={__("trueMoneyWallet")}
                      description={__("trueMoneyDescription")}
                      value="true-money-wallet"
                    />
                    <RadioMethod
                      label={__("promptpay")}
                      description={__("promptpayDescription")}
                      value="promptpay"
                    />
                  </Stack>
                </Radio.Group>
              </Stack>
            </Card>
            <Card shadow="sm" padding="lg">
              <Stack gap="xs">
                <Text size="sm" fw={500}>
                  {__("infoTitle")}
                </Text>
                <Text size="xs" c="dimmed">
                  {__("infoDescription")}
                </Text>
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }} order={{ base: 1, md: 2 }}>
          <Card shadow="sm" padding="lg">
            <Stack gap="lg">
              {/* Amount Input */}
              <Box>
                <Text size="sm" fw={500} mb="xs">
                  {__("amount")}
                </Text>
                <NumberInput
                  placeholder={__("amountPlaceholder")}
                  value={amount}
                  onChange={(value) => setAmount(value as number)}
                  min={1}
                  max={100000}
                  prefix="฿"
                  size="md"
                  styles={{
                    input: {
                      textAlign: "center",
                      fontSize: "1.2rem",
                      fontWeight: 600,
                    },
                  }}
                />
              </Box>

              {/* Topup Button */}
              <Button
                size="md"
                fullWidth
                disabled={!amount || !paymentMethod}
                onClick={handleTopup}
                mt="md"
              >
                {__("topupButton")}
              </Button>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default TopupPage;
