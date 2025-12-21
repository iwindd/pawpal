"use client";
import { AdminResourceResponse } from "@pawpal/shared";
import {
  Button,
  Divider,
  Group,
  Modal,
  Stack,
  Tabs,
  Text,
} from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import BrowseTab from "./tabs/Browse";
import UploadTab from "./tabs/Upload";

type SelectResourceTab = "browse" | "upload";

export interface SelectResourceTabProps {
  onClose: () => void;
  onSubmit?: (selectedResource: AdminResourceResponse[]) => void;
}
interface SelectResourceModalProps extends SelectResourceTabProps {
  opened: boolean;
}

const SelectResourceModal = ({
  opened,
  onSubmit,
  onClose,
}: SelectResourceModalProps) => {
  const __ = useTranslations("Resources.modal");

  const [activeTab, setActiveTab] = useState<SelectResourceTab>("browse");

  const handleClose = useCallback(() => {
    onClose();
    setActiveTab("browse");
  }, [onClose]);

  const handleSubmit = useCallback(
    (selectedResource: AdminResourceResponse[]) => {
      onSubmit?.(selectedResource);
      handleClose();
    },
    [onSubmit]
  );

  const tabProps = {
    onClose: handleClose,
    onSubmit: handleSubmit,
  };

  return (
    <Modal opened={opened} onClose={handleClose} title={__("title")} size="xl">
      <Tabs
        value={activeTab}
        onChange={(value) => setActiveTab(value as SelectResourceTab)}
        variant="outline"
      >
        <Tabs.List>
          <Tabs.Tab value="browse">{__("tab.browse")}</Tabs.Tab>
          <Tabs.Tab value="upload">{__("tab.upload")}</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="browse">
          <Stack py={"md"}>
            <BrowseTab {...tabProps} />
          </Stack>
        </Tabs.Panel>
        <Tabs.Panel value="upload">
          <Stack py={"md"}>
            <UploadTab {...tabProps} />
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Modal>
  );
};

export const SelectResourceModalFooter = ({
  children,
  onClose,
  selected,
}: Pick<SelectResourceTabProps, "onClose"> & {
  children: React.ReactNode;
  selected: AdminResourceResponse[];
}) => {
  const __ = useTranslations("Resources.modal");

  return (
    <>
      <Divider />
      <Group justify="space-between" mt="md">
        <Group>
          {selected.length > 0 && (
            <Text>
              {__("selected", {
                name: selected.map((item) => item.id).join(", "),
              })}
            </Text>
          )}
        </Group>
        <Group>
          <Button onClick={onClose} variant="outline">
            {__("actions.cancel")}
          </Button>
          {children}
        </Group>
      </Group>
    </>
  );
};

export default SelectResourceModal;
