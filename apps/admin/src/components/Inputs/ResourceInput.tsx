import { useLazyGetResourceQuery } from "@/features/resource/resourceApi";
import useUploadImage from "@/hooks/useUploadImage";
import { Util } from "@/libs/utils";
import { IconChange } from "@pawpal/icons";
import { AdminResourceResponse } from "@pawpal/shared";
import { useDisclosure } from "@pawpal/ui/hooks";
import { useEffect } from "react";
import SelectResourceModal from "../Modals/SelectResourceModal";
import { DropzoneInputProps } from "./DropzoneInput";
import UploadResourceInput from "./UploadResourceInput";

interface ResourceInputProps extends Omit<
  DropzoneInputProps,
  "onDrop" | "onClick"
> {
  onChange?: (value: AdminResourceResponse["id"] | null) => void;
  defaultValue?: AdminResourceResponse["id"];
  value?: AdminResourceResponse["id"];
}

const ResourceInput = ({
  defaultValue,
  value,
  w,
  h,
  onChange,
  placeholder,
  hint,
  error,
}: ResourceInputProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [getResourceQuery, { isLoading }] = useLazyGetResourceQuery();
  const uploadImage = useUploadImage({
    onUploaded: (resp) => {
      const resource = resp[0];
      if (!resource) return;
      onChange?.(resource.id);
      uploadImage.setPreviews([Util.getResourceUrl(resource.url)]);
    },
  });

  const handleBrowseResource = (selectedResources: AdminResourceResponse[]) => {
    const selectedResource = selectedResources[0];
    if (!selectedResource) return;
    onChange?.(selectedResource.id);
    uploadImage.setPreviews([Util.getResourceUrl(selectedResource.url)]);
  };

  const fetchResource = async (id: string) => {
    const { data: resource, ...response } = await getResourceQuery(id);
    if (response.isError || !resource) return;
    uploadImage.setPreviews([Util.getResourceUrl(resource.url)]);

    if (value != id) {
      onChange?.(id);
    }
  };

  useEffect(() => {
    if (!defaultValue) return;
    fetchResource(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (!value) return;
    fetchResource(value);
  }, [value]);

  return (
    <>
      <UploadResourceInput
        hint={hint}
        placeholder={placeholder}
        uploadImage={uploadImage}
        onClick={open}
        error={error}
        disabled={isLoading}
        overlayIcon={<IconChange size={42} />}
        overlayOnClick={open}
        w={w}
        h={h}
      />

      <SelectResourceModal
        onSubmit={handleBrowseResource}
        opened={opened}
        onClose={close}
      />
    </>
  );
};

export default ResourceInput;
