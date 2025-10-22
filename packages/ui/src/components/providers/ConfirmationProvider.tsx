"use client";
import { Button, ButtonProps, Group, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useTranslations } from "next-intl";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";

type ConfirmOptions = {
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmProps?: Omit<ButtonProps, "onClick">;
  cancelProps?: Omit<ButtonProps, "onClick">;
};

type ConfirmationContextType = {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

const ConfirmationContext = createContext<ConfirmationContextType | null>(null);

export function ConfirmationProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const __ = useTranslations("__ConfirmationProvider");
  const [opened, { open, close }] = useDisclosure(false);
  const [options, setOptions] = useState<ConfirmOptions>({});
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(
    null
  );

  const confirm = (opts: ConfirmOptions) => {
    setOptions(opts);
    open();
    return new Promise<boolean>((resolve) => setResolver(() => resolve));
  };

  const handleConfirm = () => {
    close();
    resolver?.(true);
  };

  const handleCancel = () => {
    close();
    resolver?.(false);
  };

  const obj = useMemo(() => ({ confirm }), []);

  return (
    <ConfirmationContext.Provider value={obj}>
      {children}
      <Modal
        opened={opened}
        onClose={handleCancel}
        title={options.title || __("title")}
      >
        <Text>{options.message || __("message")}</Text>

        <Group mt="lg" justify="flex-end">
          <Button
            variant="default"
            {...options.cancelProps}
            onClick={handleCancel}
          >
            {options.cancelLabel || __("cancel")}
          </Button>
          <Button {...options.confirmProps} onClick={handleConfirm}>
            {options.confirmLabel || __("confirm")}
          </Button>
        </Group>
      </Modal>
    </ConfirmationContext.Provider>
  );
}

export const useConfirmation = () => {
  const ctx = useContext(ConfirmationContext);
  if (!ctx) throw new Error("useConfirmation must be used inside provider");
  return ctx;
};
