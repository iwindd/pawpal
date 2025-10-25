"use client";
import { useAuth } from "@/contexts/AuthContext";
import usePaymentGateway from "@/hooks/usePaymentGateway";
import API from "@/libs/api/client";
import { backdrop } from "@pawpal/ui/backdrop";
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
import { Notifications } from "@pawpal/ui/notifications";
import { useTranslations } from "next-intl";
import { useState } from "react";
import RadioMethod from "./components/RadioMethod";

const TopupPage = () => {
  const __ = useTranslations("Topup");
  const [amount, setAmount] = useState<number | "">("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const { refreshProfile } = useAuth();
  const paymentGateways = usePaymentGateway();

  const handleTopup = async () => {
    if (!amount || !paymentMethod) return;

    try {
      backdrop.show({
        text: __("topupLoading"),
      });
      const response = await API.payment.topup(amount, paymentMethod);
      if (!response.success) throw new Error("Topup failed");
      refreshProfile();
      Notifications.show({
        title: __("notify.success.title"),
        message: __("notify.success.message"),
        color: "green",
      });
    } catch (error) {
      Notifications.show({
        title: __("notify.error.title"),
        message: __("notify.error.message"),
        color: "red",
      });
      console.error(error);
    } finally {
      backdrop.hide();
    }
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
                  <Stack gap="xs">
                    {paymentGateways.data?.map((gateway) => (
                      <RadioMethod
                        key={gateway.id}
                        label={gateway.label}
                        description={gateway.text}
                        value={gateway.id}
                      />
                    ))}
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
