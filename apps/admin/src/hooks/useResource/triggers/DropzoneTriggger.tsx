import ResourceImage from "@/components/ResourceImage";
import { IconChange, IconPhoto, IconUpload, IconX } from "@pawpal/icons";
import { AspectRatio, Group, Input, Paper, Stack, Text } from "@pawpal/ui/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@pawpal/ui/dropzone";
import { useTranslations } from "next-intl";
import useResource from "..";
import classes from "./style.module.css";
import {
  DropzoneTriggerHasImageProps,
  DropzoneTriggerNoImageProps,
  DropzoneTriggerProps,
} from "./type";

const HasImage = ({
  selectedResource,
  onOpen,
  error,
}: DropzoneTriggerHasImageProps) => {
  const __ = useTranslations("Resources.modal");

  return (
    <Paper
      radius={"sm"}
      style={{
        overflow: "hidden",
        border: error ? "1px solid var(--mantine-color-error)" : undefined,
        borderColor: error ? "var(--mantine-color-error)" : undefined,
      }}
    >
      <AspectRatio
        ratio={1920 / 530}
        maw={1920}
        mih={260}
        mx="auto"
        style={{
          position: "relative",
        }}
      >
        <button type="button" className={classes.overlay} onClick={onOpen}>
          <Stack align="center" gap={8} justify="center">
            <IconChange size={42} />
            <Text>{__("change_image")}</Text>
          </Stack>
        </button>

        <ResourceImage
          alt={"Selected Resource"}
          src={selectedResource.url}
          fill
          style={{ objectFit: "cover" }}
        />
      </AspectRatio>
    </Paper>
  );
};

const NoImage = ({
  label,
  hint,
  onOpen,
  error,
}: DropzoneTriggerNoImageProps) => {
  const __ = useTranslations("Resources.modal");

  /* TODO:: Upload drag and drop */
  return (
    <Dropzone
      m={0}
      onDrop={(files) => console.log("accepted files", files)}
      maxSize={5 * 1024 ** 2}
      onClick={onOpen}
      accept={IMAGE_MIME_TYPE}
      style={{
        borderColor: error ? "var(--mantine-color-error)" : undefined,
      }}
    >
      <Group
        justify="center"
        gap="xl"
        mih={220}
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

        <div>
          <Text size="xl" inline>
            {label}
          </Text>
          <Text size="sm" c="dimmed" inline mt={7}>
            {hint}
          </Text>
        </div>
      </Group>
    </Dropzone>
  );
};

const DropzoneTrigger = ({
  label,
  hint,
  onChange,
  error,
}: DropzoneTriggerProps) => {
  const __ = useTranslations("Resources.modal");
  const resource = useResource({
    onResourceSelect: (resource) => {
      if (onChange) {
        onChange(resource.id);
      }
    },
  });

  return (
    <Stack gap={"xs"}>
      <Input.Label required>{label}</Input.Label>

      {resource.selectedResource ? (
        <HasImage
          selectedResource={resource.selectedResource}
          onOpen={resource.open}
          error={error}
        />
      ) : (
        <NoImage
          label={label}
          hint={hint}
          onOpen={resource.open}
          error={error}
        />
      )}

      <Input.Error>{error}</Input.Error>
      {resource.modal}
    </Stack>
  );
};

export default DropzoneTrigger;
