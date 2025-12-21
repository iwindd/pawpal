import { useUploadResourceMutation } from "@/features/resource/resourceApi";
import { IconCheck, IconX } from "@pawpal/icons";
import { AdminResourceResponse, resourceUploadSchema } from "@pawpal/shared";
import { notify } from "@pawpal/ui/notifications";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

interface UseUploadImageProps {
  autoUpload?: boolean;
  onUploaded?: (resp: AdminResourceResponse[]) => void;
}

export type UseUploadImageReturn = ReturnType<typeof useUploadImage>;

const useUploadImage = (props?: UseUploadImageProps) => {
  const { autoUpload = true, onUploaded } = props || {};
  const __ = useTranslations("Resources.UploadModal");
  const [uploadResourceMutation, { isLoading: isUploading, error }] =
    useUploadResourceMutation();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<FileList | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (!files) {
      setPreviews([]);
      return;
    }

    const objectUrls = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setPreviews(objectUrls);

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const clear = () => {
    setFiles(null);
    setPreviews([]);
    if (inputRef.current) inputRef.current.value = "";
  };

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

  const upload = async () => {
    if (!files) {
      return console.error("No files");
    }

    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (file) {
        if (!validate(file)) return;
        formData.append("files", file);
      }
    }

    const resp = await uploadResourceMutation(formData);
    clear();

    return resp;
  };

  const handleUpload = async () => {
    notify.show({
      id: "uploading",
      message: __("notify.uploading.message"),
      color: "blue",
      autoClose: false,
      loading: true,
    });
    const resp = await upload();

    if (!resp || resp.error) {
      if (resp?.error) console.error(resp?.error);

      notify.update({
        id: "uploading",
        loading: false,
        icon: <IconX size={18} />,
        autoClose: 2000,
        title: __("notify.error.title"),
        message: __("notify.error.message"),
        color: "red",
      });

      return resp;
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

    onUploaded?.(resp.data);
  };

  const open = () => {
    inputRef.current?.click();
  };

  const inputProps = {
    ref: inputRef,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        setFiles(files);
      }
    },
  };

  useEffect(() => {
    if (autoUpload && files && files.length > 0) handleUpload();
  }, [autoUpload, files]);

  return {
    open,
    setFiles,
    upload,
    clear,
    previews,
    setPreviews,
    inputProps,
    input: <input type="file" multiple hidden {...inputProps} />,
    files,
    states: {
      isUploading,
      error,
    },
  };
};

export default useUploadImage;
