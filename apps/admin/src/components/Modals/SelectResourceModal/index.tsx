"use client";
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
import { useState } from "react";
import { ResourceResponse } from "../../../../../../packages/shared/dist/types/response/resource";
import BrowseTab from "./tabs/Browse";
import UploadTab from "./tabs/Upload";

type SelectResourceTab = "browse" | "upload";

interface SelectResourceModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit?: (selectedResource: ResourceResponse) => void;
}

const SelectResourceModal = ({
  opened,
  onClose,
  onSubmit,
}: SelectResourceModalProps) => {
  const __ = useTranslations("Resources.modal");
  const [selectedRecord, setSelectedRecord] = useState<
    Record<SelectResourceTab, ResourceResponse | null>
  >({
    browse: null,
    upload: null,
  });
  const [activeTab, setActiveTab] = useState<SelectResourceTab | null>(
    "browse"
  );
  const handleSelectedRecordsChange = (
    tab: SelectResourceTab,
    selectedRecords: ResourceResponse[]
  ) => {
    setSelectedRecord((prev) => ({
      ...prev,
      [tab]: selectedRecords.length > 0 ? selectedRecords[0] : null,
    }));
  };

  const currentSelectedRecord = activeTab ? selectedRecord[activeTab] : null;

  const handleSubmit = () => {
    if (currentSelectedRecord) {
      onSubmit?.(currentSelectedRecord);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title={__("title")} size="xl">
      <Tabs
        value={activeTab}
        onChange={(value) => setActiveTab(value as SelectResourceTab)}
        variant="outline"
        defaultValue="browse"
      >
        <Tabs.List>
          <Tabs.Tab value="browse">{__("tab.browse")}</Tabs.Tab>
          <Tabs.Tab value="upload">{__("tab.upload")}</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="browse">
          <Stack py={"md"}>
            <BrowseTab
              onSelectedRecordsChange={(selectedRecords) =>
                handleSelectedRecordsChange("browse", selectedRecords)
              }
            />
          </Stack>
        </Tabs.Panel>
        <Tabs.Panel value="upload">
          <Stack py={"md"}>
            {/* TODO:: Implement UploadTab */}
            <UploadTab />
          </Stack>
        </Tabs.Panel>
      </Tabs>

      <Divider />
      <Group justify="space-between" mt="md">
        <Group>
          {currentSelectedRecord && (
            <Text>
              {__("selected", {
                name: currentSelectedRecord.id,
              })}
            </Text>
          )}
        </Group>
        <Group>
          <Button onClick={onClose} variant="outline">
            {__("actions.cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={!currentSelectedRecord}>
            {__("actions.confirm")}
          </Button>
        </Group>
      </Group>
    </Modal>
  );
};

export default SelectResourceModal;
