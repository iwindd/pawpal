import { useConfirmChargeMutation } from "@/features/payment/paymentApi";
import { useAppSelector } from "@/hooks";
import { PaymentChargeCreatedResponse } from "@pawpal/shared";
import { Button, Group, Modal, Stack, Text, Title } from "@pawpal/ui/core";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useTranslations } from "next-intl";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

interface PromptPayManualModal {
  onSuccess?: (response: PaymentChargeCreatedResponse) => void;
  onError?: (error?: FetchBaseQueryError | SerializedError) => void;
}

export const PromptPayManualModal = ({
  onSuccess,
  onError,
}: PromptPayManualModal) => {
  const __ = useTranslations("PromptPayManualModal");
  const [promptPayModal, setPromptPayModal] = useState(false);
  const currentCharge = useAppSelector((state) => state.payment.currentCharge);
  const [confirmChargeMutation, { isLoading }] = useConfirmChargeMutation();
  const payload = currentCharge?.qrcode;
  const payment = currentCharge?.payment.metadata;
  const chargeId = currentCharge?.id;

  const onSubmit = async () => {
    if (!chargeId) return;
    const response = await confirmChargeMutation(chargeId);
    setPromptPayModal(false);

    if (response.error) {
      console.error(response.error);
      onError?.(response.error);
      return;
    }

    onSuccess?.(response.data);
  };

  useEffect(() => {
    setPromptPayModal(currentCharge != null);
  }, [currentCharge]);

  return (
    <Modal
      opened={promptPayModal}
      onClose={() => setPromptPayModal(false)}
      withCloseButton={false}
      closeOnClickOutside={false}
      closeOnEscape={false}
      title={__("title")}
      centered
    >
      <Group justify="center">
        {payload && <QRCodeSVG value={payload} size={256} />}
      </Group>
      {payment && (
        <Stack align="center" p={"sm"} gap={"xs"}>
          <Title>{payment?.name}</Title>
          <Text size="xs" c="dimmed">
            {__("description", {
              number: payment?.number || "",
            })}
          </Text>
        </Stack>
      )}
      <Group justify="center" mt={"xs"}>
        <Button
          fullWidth
          onClick={onSubmit}
          loading={isLoading}
          disabled={isLoading}
        >
          {__("submit-btn")}
        </Button>
      </Group>
    </Modal>
  );
};

export default PromptPayManualModal;
