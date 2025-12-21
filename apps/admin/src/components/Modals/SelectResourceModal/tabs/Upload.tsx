import UploadResourceInput from "@/components/Inputs/UploadResourceInput";
import useUploadImage from "@/hooks/useUploadImage";
import { backdrop } from "@pawpal/ui/backdrop";
import { Button } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import { SelectResourceModalFooter, SelectResourceTabProps } from "..";

interface UploadTabProps extends SelectResourceTabProps {}

const UploadTab = ({ onSubmit, onClose }: UploadTabProps) => {
  const __ = useTranslations("Resources.modal");
  const uploadImage = useUploadImage({
    autoUpload: false,
  });

  const handleSelectedRecordsChange = async () => {
    onClose();
    backdrop.show(__("backdrop.uploading"));
    const resp = await uploadImage.upload();
    backdrop.hide();

    if (!resp || resp.error) {
      console.error((resp && resp.error) || "Upload failed");

      return uploadImage.clear();
    }

    onSubmit?.(resp.data);
  };

  return (
    <>
      <UploadResourceInput
        uploadImage={uploadImage}
        placeholder={__("dropzone.placeholder")}
        hint={__("dropzone.hint")}
      />
      <SelectResourceModalFooter onClose={onClose} selected={[]}>
        <Button
          onClick={handleSelectedRecordsChange}
          disabled={!uploadImage.files}
        >
          {__("actions.uploadAndSelect")}
        </Button>
      </SelectResourceModalFooter>
    </>
  );
};

export default UploadTab;
