import { Button, Group, Modal, Stack, Text, Title } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { PaymentChargeCreatedResponse } from "../../../../../packages/shared/dist";

interface PromptPayManualModalProps {
  qrcode?: string;
  payment?: PaymentChargeCreatedResponse["payment"]["metadata"];
  opened: boolean;
  onClose: () => void;
}

const PromptPayManualModal = ({
  opened,
  onClose,
  qrcode,
  payment,
}: PromptPayManualModalProps) => {
  const __ = useTranslations("PromptPayManualModal");
  const [payload, setPayload] = useState<string>(qrcode || "");

  useEffect(() => {
    setPayload(qrcode || "");
  }, [qrcode]);

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
