import { useConfirmChargeMutation } from "@/features/payment/paymentApi";
import { useAppSelector } from "@/hooks";
import { Button, Group, Modal, Stack, Text, Title } from "@pawpal/ui/core";
import { Notifications } from "@pawpal/ui/notifications";
import { useTranslations } from "next-intl";
import { QRCodeSVG } from "qrcode.react";

interface PromptPayManualModalProps {
  opened: boolean;
  onClose: () => void;
}

const PromptPayManualModal = ({
  opened,
  onClose,
}: PromptPayManualModalProps) => {
  const __ = useTranslations("PromptPayManualModal");
  const currentCharge = useAppSelector((state) => state.payment.currentCharge);
  const [confirmChargeMutation, { isLoading }] = useConfirmChargeMutation();
  const payload = currentCharge?.qrcode;
  const payment = currentCharge?.payment.metadata;
  const chargeId = currentCharge?.id;

  if (!currentCharge) return null;

  const onSubmit = async () => {
    if (!chargeId) return;
    const response = await confirmChargeMutation(chargeId);
    onClose();

    if (response.error) {
      console.error(response.error);
      Notifications.show({
        title: __("notify.error.title"),
        message: __("notify.error.message"),
        color: "red",
      });

      return;
    }

    Notifications.show({
      id: `topup-${chargeId}`,
      title: __("notify.success.title"),
      message: __("notify.success.message"),
      color: "pawpink",
      autoClose: false,
      withCloseButton: false,
      loading: true,
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
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
