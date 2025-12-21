import ResourceImage from "@/components/ResourceImage";
import { Util } from "@/libs/utils";
import { IconChevronLeft, IconChevronRight, IconPhoto } from "@pawpal/icons";
import { AdminResourceResponse } from "@pawpal/shared";
import {
  ActionIcon,
  Box,
  Flex,
  Group,
  Modal,
  Stack,
  Text,
} from "@pawpal/ui/core";
import { useDisclosure } from "@pawpal/ui/hooks";
import { useEffect, useState } from "react";

interface ViewResouceImageModalProps {
  resource: AdminResourceResponse | null;
  close: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
  next?: () => void;
  prev?: () => void;
}

const ViewResouceImageModal = ({
  resource,
  close: onClose,
  hasNext,
  hasPrev,
  next,
  prev,
}: ViewResouceImageModalProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const handleClose = () => {
    close();
    onClose();
  };

  useEffect(() => {
    if (resource) {
      const img = new Image();
      img.src = Util.getResourceUrl(resource.url);
      img.onload = () => {
        setSize({
          w: img.naturalWidth,
          h: img.naturalHeight,
        });
      };

      open();
    } else {
      handleClose();
    }
  }, [resource]);

  return (
    <Modal.Root opened={opened} onClose={handleClose} fullScreen>
      <Modal.Overlay backgroundOpacity={0.8} blur={6} />
      <Modal.Content
        style={{
          background: "transparent",
          boxShadow: "none",
        }}
      >
        <Modal.Body
          h="100%"
          display={"flex"}
          style={{
            flexDirection: "column",
          }}
        >
          <Group justify="space-between">
            <Group>
              <Modal.CloseButton />
              <Group gap={"xs"}>
                <IconPhoto />
                <Text truncate>{resource?.id}</Text>
              </Group>
            </Group>
          </Group>
          <Flex
            style={{
              width: "100%",
              height: "700px",
              position: "relative",
              overflow: "hidden",
            }}
            mt={6}
            flex={1}
            justify={"space-between"}
            align={"center"}
            gap={"xs"}
            onClick={(e) => {
              const target = e.target as HTMLElement;

              if (!target.closest("button") && !target.closest("img")) {
                handleClose();
              }
            }}
          >
            <Stack visibleFrom="sm">
              <ActionIcon
                variant="filled"
                size={"xl"}
                color="dark"
                onClick={prev}
                disabled={!hasPrev}
              >
                <IconChevronLeft />
              </ActionIcon>
            </Stack>
            <Box
              style={{
                width: `${size.w}px`,
                height: `${size.h}px`,
                maxWidth: "100%",
                maxHeight: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {resource && (
                <ResourceImage
                  src={resource.url}
                  alt={resource.id}
                  width={size.w}
                  height={size.h}
                />
              )}
            </Box>
            <Stack visibleFrom="sm">
              <ActionIcon
                variant="filled"
                size={"xl"}
                color="dark"
                onClick={next}
                disabled={!hasNext}
              >
                <IconChevronRight />
              </ActionIcon>
            </Stack>
          </Flex>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default ViewResouceImageModal;
