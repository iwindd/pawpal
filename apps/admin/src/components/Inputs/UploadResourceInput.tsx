import { UseUploadImageReturn } from "@/hooks/useUploadImage";
import { Util } from "@/libs/utils";
import { IconX } from "@pawpal/icons";
import { Input, Stack } from "@pawpal/ui/core";
import { FileWithPath } from "@pawpal/ui/dropzone";
import OverlayImage from "../Images/OverlayImage/OverlayImage";
import DropzoneInput, { DropzoneInputProps } from "./DropzoneInput";

interface ResourceInputProps extends Pick<
  DropzoneInputProps,
  "hint" | "placeholder" | "onClick"
> {
  label?: string;
  error?: string;
  h?: string | number;
  w?: string | number;
  disabled?: boolean;
  uploadImage: UseUploadImageReturn;
  overlayIcon?: React.ReactNode;
  overlayOnClick?: () => void;
}

const UploadResourceInput = ({
  label,
  error,
  placeholder,
  hint,
  onClick,
  disabled,
  h = 400,
  w = "100%",
  overlayIcon = <IconX size={42} />,
  overlayOnClick,
  uploadImage,
}: ResourceInputProps) => {
  return (
    <Stack gap={"xs"} w={w} h={h}>
      {label && <Input.Label>{label}</Input.Label>}

      {uploadImage.previews.length <= 0 ? (
        <DropzoneInput
          h={h}
          w={w}
          placeholder={placeholder}
          disabled={disabled}
          hint={hint}
          onDrop={(files: FileWithPath[]) => {
            const file = files[0];
            if (!file) return uploadImage.clear();
            const fileList = Util.fileWithPathToFileList([file]);
            uploadImage.setFiles(fileList);
          }}
          onClick={onClick}
        />
      ) : (
        <OverlayImage
          h={h}
          w={w}
          disabled={disabled}
          image={
            <img
              src={uploadImage.previews[0]}
              alt="preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          }
          onClick={overlayOnClick || uploadImage.clear}
        >
          <Stack align="center" gap={8} justify="center">
            {overlayIcon}
          </Stack>
        </OverlayImage>
      )}

      {error && <Input.Error>{error}</Input.Error>}
    </Stack>
  );
};

export default UploadResourceInput;
