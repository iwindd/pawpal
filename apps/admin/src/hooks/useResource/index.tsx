import SelectResourceModal from "@/components/Modals/SelectResourceModal";
import API from "@/libs/api/client";
import { ResourceResponse } from "@pawpal/shared";
import { useDisclosure } from "@pawpal/ui/hooks";
import { useEffect, useState } from "react";

interface UseResourceProps {
  onResourceSelect?: (resource: ResourceResponse) => void;
  defaultValue?: string;
  value?: string;
}

const useResource = ({
  onResourceSelect,
  defaultValue,
  value,
}: UseResourceProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedResource, setSelectedResource] =
    useState<ResourceResponse | null>(null);

  const fetchResource = async (id: string) => {
    setIsLoading(true);

    try {
      const response = await API.resource.findOne(id);
      if (response.success) {
        setSelectedResource(response.data);
      }
    } catch (error) {
      console.error("Error fetching resource:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const valueToUse = value || defaultValue;
    if (
      valueToUse &&
      (!selectedResource || selectedResource.id !== valueToUse)
    ) {
      fetchResource(valueToUse);
    }
  }, [defaultValue, value, fetchResource, selectedResource]);

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
    isLoading,
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
