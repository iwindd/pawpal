import SelectResourceModal from "@/components/Modals/SelectResourceModal";
import { ResourceResponse } from "@pawpal/shared";
import { useDisclosure } from "@pawpal/ui/hooks";
import { useState } from "react";

interface UseResourceProps {
  onResourceSelect?: (resource: ResourceResponse) => void;
}

const useResource = ({ onResourceSelect }: UseResourceProps) => {
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
    if (onResourceSelect) {
      onResourceSelect(selectedResource);
    }
  };

  return {
    isSelecting,
    selectedResource,
    open: handleOpen,
    close: handleClose,
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
