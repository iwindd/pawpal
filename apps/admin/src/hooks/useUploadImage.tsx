import { useUploadResourceMutation } from "@/features/resource/resourceApi";
import { resourceUploadSchema } from "@pawpal/shared";
import { backdrop } from "@pawpal/ui/backdrop";
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
      return;
    }

    return schema.data;
  };

  const upload = async (file: File) => {
    if (!validate(file)) return;

    const formData = new FormData();
    formData.append("file", file);

    backdrop.show("Uploading...");
    const resp = await uploadResourceMutation(formData);
    backdrop.hide();

    if (!resp.data || resp.error) {
      console.error(resp.error);
      return notify.show({
        title: __("notify.error.title"),
        message: __("notify.error.message"),
        color: "red",
      });
    }

    notify.show({
      title: __("notify.success.title"),
      message: __("notify.success.message"),
      color: "green",
    });
  };

  const open = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      upload(file);
    }
  };

  return {
    open,
    input: (
      <input ref={inputRef} type="file" hidden onChange={handleFileChange} />
    ),
  };
};

export default useUploadImage;
