import { useAppSelector } from "@/hooks";
import { Button, Group, Modal, Stack, Text, Title } from "@pawpal/ui/core";
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
  const payload = currentCharge?.qrcode;
  const payment = currentCharge?.payment.metadata;

  if (!currentCharge) return null;

  return (
    <Modal opened={opened} onClose={onClose} title={__("title")} centered>
      <Group justify="center">
        {payload && <QRCodeSVG value={payload} size={256} />}
      </Group>
      {payment && (
        <Stack align="center" p={"sm"} gap={0}>
          <Title>{payment?.name}</Title>
          <Text size="xs" c="dimmed">
            {__("description", {
              number: payment?.number || "",
            })}
          </Text>
        </Stack>
      )}
      <Group justify="center" mt={"xs"}>
        <Button fullWidth onClick={onClose}>
          {__("submit-btn")}
        </Button>
      </Group>
    </Modal>
  );
};

export default PromptPayManualModal;
