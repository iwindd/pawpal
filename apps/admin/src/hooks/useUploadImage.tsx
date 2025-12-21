import { useUploadResourceMutation } from "@/features/resource/resourceApi";
import { IconCheck, IconX } from "@pawpal/icons";
import { resourceUploadSchema } from "@pawpal/shared";
import { notify } from "@pawpal/ui/notifications";
import { useTranslations } from "next-intl";
import { useRef } from "react";

const useUploadImage = () => {
  const __ = useTranslations("Resources.UploadModal");
  const [uploadResourceMutation] = useUploadResourceMutation();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const validate = (file: File) => {
    const schema = resourceUploadSchema.safeParse({
      file,
    });

    if (!schema.success) {
      console.error(schema.error);
      notify.show({
        title: __("notify.error.title"),
        message: __("notify.error.message"),
        color: "red",
      });
      return false;
    }

    return true;
  };

  const upload = async (files: FileList) => {
    const formData = new FormData();
    // Validate all files first
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (file) {
        if (!validate(file)) return;
        formData.append("files", file);
      }
    }

    notify.show({
      id: "uploading",
      message: __("notify.uploading.message"),
      color: "blue",
      autoClose: false,
      loading: true,
    });
    const resp = await uploadResourceMutation(formData);
    if (inputRef.current) inputRef.current.value = "";

    if (!resp.data || resp.error) {
      console.error(resp.error);
      return notify.update({
        id: "uploading",
        loading: false,
        icon: <IconX size={18} />,
        autoClose: 2000,
        title: __("notify.error.title"),
        message: __("notify.error.message"),
        color: "red",
      });
    }

    notify.update({
      id: "uploading",
      loading: false,
      icon: <IconCheck size={18} />,
      autoClose: 2000,
      title: __("notify.success.title"),
      message: __("notify.success.message"),
      color: "green",
    });
  };

  const open = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      upload(files);
    }
  };

  return {
    open,
    input: (
      <input
        ref={inputRef}
        type="file"
        multiple
        hidden
        onChange={handleFileChange}
      />
    ),
  };
};

export default useUploadImage;
