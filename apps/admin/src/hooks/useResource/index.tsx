import SelectResourceModal from "@/components/Modals/SelectResourceModal";
import { useLazyGetResourceQuery } from "@/services/resource";
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
  const [selectedResource, setSelectedResource] =
    useState<ResourceResponse | null>(null);
  const [getResourceQuery, { isLoading }] = useLazyGetResourceQuery();

  const fetchResource = async (id: string) => {
    const { data: resource, ...response } = await getResourceQuery(id);
    if (response.isError || !resource) return;
    setSelectedResource(resource);
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
