import SelectResourceModal from "@/components/Modals/SelectResourceModal";
import { ResourceResponse } from "@pawpal/shared";
import { useDisclosure } from "@pawpal/ui/hooks";
import { useState } from "react";

export { default as DropzoneTrigger } from "./triggers/DropzoneTriggger";

export interface TriggerProps {
  onOpen: () => void;
  onClose: () => void;
  selectedResource: ResourceResponse | null;
}

const useResource = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [selectedResource, setSelectedResource] =
    useState<ResourceResponse | null>(null);

  const handleOpen = () => {
    setIsSelecting(true);
    open();
  };

  const handleClose = () => {
    setIsSelecting(false);
    close();
  };

  const onSubmit = (selectedResource: ResourceResponse) => {
    setSelectedResource(selectedResource);
    handleClose();
  };

  return {
    isSelecting,
    selectedResource,
    trigger: {
      onOpen: handleOpen,
      onClose: handleClose,
      selectedResource,
    },
    modal: (
      <SelectResourceModal
        opened={opened}
        onClose={handleClose}
        onSubmit={onSubmit}
      ></SelectResourceModal>
    ),
  };
};

export default useResource;
