import ResourceImage from "@/components/ResourceImage";
import { IconChange, IconPhoto, IconUpload, IconX } from "@pawpal/icons";
import { AspectRatio, Group, Paper, Stack, Text } from "@pawpal/ui/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@pawpal/ui/dropzone";
import { useTranslations } from "next-intl";
import { TriggerProps } from "..";
import classes from "./style.module.css";

interface DropzoneTriggerProps extends TriggerProps {}

const DropzoneTrigger = ({
  onOpen,
  selectedResource,
}: DropzoneTriggerProps) => {
  const __ = useTranslations("Resources.modal");

  if (selectedResource) {
    return (
      <Paper radius={"sm"} style={{ overflow: "hidden" }}>
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
  }

  /* TODO:: Upload drag and drop */
  return (
    <Dropzone
      onDrop={(files) => console.log("accepted files", files)}
      maxSize={5 * 1024 ** 2}
      onClick={onOpen}
      accept={IMAGE_MIME_TYPE}
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
            Drag images here or click to select files
          </Text>
          <Text size="sm" c="dimmed" inline mt={7}>
            Attach as many as you like, each file should not exceed 5mb
          </Text>
        </div>
      </Group>
    </Dropzone>
  );
};

export default DropzoneTrigger;
