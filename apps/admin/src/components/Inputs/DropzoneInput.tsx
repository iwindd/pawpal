import { IconPhoto, IconUpload, IconX } from "@pawpal/icons";
import { Group, Text } from "@pawpal/ui/core";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@pawpal/ui/dropzone";

export interface DropzoneInputProps {
  placeholder?: string;
  hint?: string;
  error?: string;
  h?: string | number;
  w?: string | number;
  disabled?: boolean;
  onDrop: (files: FileWithPath[]) => void;
  onClick?: (e: React.MouseEvent) => void;
}

const DropzoneInput = ({
  placeholder,
  hint,
  error,
  h,
  w,
  disabled,
  onDrop,
  onClick,
}: DropzoneInputProps) => {
  return (
    <Dropzone
      m={0}
      h={h}
      w={w}
      onDrop={onDrop}
      onClick={disabled || !onClick ? undefined : onClick}
      maxSize={5 * 1024 ** 2}
      accept={IMAGE_MIME_TYPE}
      disabled={disabled}
      style={{
        borderColor: error ? "var(--mantine-color-error)" : undefined,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Group
        justify="center"
        align="center"
        gap="xl"
        style={{ pointerEvents: "none" }}
      >
        <Dropzone.Accept>
          <IconUpload
            size={52}
            color="var(--mantine-color-blue-6)"
            stroke={1.5}
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX size={52} color="var(--mantine-color-red-6)" stroke={1.5} />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconPhoto
            size={52}
            color="var(--mantine-color-dimmed)"
            stroke={1.5}
          />
        </Dropzone.Idle>

        {(placeholder || hint) && (
          <div>
            <Text size="xl" inline>
              {placeholder}
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              {hint}
            </Text>
          </div>
        )}
      </Group>
    </Dropzone>
  );
};

export default DropzoneInput;
