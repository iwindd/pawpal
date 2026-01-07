"use client";
import PromptPayManualModal from "@/components/Modals/PromptPayManualModal";
import { useGetActivePaymentGatewayQuery } from "@/features/paymentGateway/paymentGatewayApi";
import { useCreateChargeMutation } from "@/features/topup/topupApi";
import useFormValidate from "@/hooks/useFormValidate";
import {
  PaymentChargeCreatedResponse,
  PaymentChargeCreateInput,
  PaymentChargeCreateSchema,
} from "@pawpal/shared";
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
import { useEffect } from "react";
import RadioMethod from "./components/RadioMethod";

const TopupPage = () => {
  const __ = useTranslations("Topup");
  const { data: paymentGateways } = useGetActivePaymentGatewayQuery();
  const [createChargeMutation, { isLoading }] = useCreateChargeMutation();

  const form = useFormValidate<PaymentChargeCreateInput>({
    schema: PaymentChargeCreateSchema,
    initialValues: {
      amount: 100,
      payment_id: "",
    },
    enhanceGetInputProps: () => ({
      disabled: isLoading,
    }),
  });

  useEffect(() => {
    if (!paymentGateways?.[0]) return;
    form.setValues({
      ...form.getValues(),
      payment_id: paymentGateways[0].id,
    });
  }, [paymentGateways]);

  const onConfirmTopup = async (payload: PaymentChargeCreateInput) => {
    const response = await createChargeMutation(payload);

    if (response.error) {
      return Notifications.show({
        title: __("notify.error.title"),
        message: __("notify.error.message"),
        color: "red",
      });
    }
  };

  const onTopupSuccess = async (response: PaymentChargeCreatedResponse) => {
    Notifications.show({
      id: `topup-${response.id}`,
      title: __("notify.success.title"),
      message: __("notify.success.message"),
      color: "pawpink",
      autoClose: false,
      withCloseButton: false,
      loading: true,
    });
  };

  const onTopupError = () => {
    Notifications.show({
      title: __("notify.error.title"),
      message: __("notify.error.message"),
      color: "red",
    });
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
      <form onSubmit={form.onSubmit(onConfirmTopup)}>
        <Grid gutter="sm">
          <Grid.Col span={{ base: 12, md: 8 }} order={{ base: 2, md: 1 }}>
            <Stack gap="sm">
              {/* Additional Info */}
              <Card shadow="sm" padding="lg">
                <Text size="sm" fw={500} mb="md">
                  {__("paymentMethod")}
                </Text>
                <Stack gap="sm">
                  <Radio.Group
                    key={form.key("payment_id")}
                    {...form.getInputProps("payment_id")}
                  >
                    <Stack gap="xs">
                      {paymentGateways?.map((gateway) => (
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
                    key={form.key("amount")}
                    {...form.getInputProps("amount")}
                  />
                </Box>

                {/* Topup Button */}
                <Button
                  size="md"
                  fullWidth
                  type="submit"
                  mt="md"
                  loading={isLoading}
                >
                  {__("topupButton")}
                </Button>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>
      </form>

      <PromptPayManualModal onSuccess={onTopupSuccess} onError={onTopupError} />
    </Container>
  );
};

export default TopupPage;
