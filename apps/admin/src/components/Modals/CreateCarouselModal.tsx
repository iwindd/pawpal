"use client";
import useResource, { DropzoneTrigger } from "@/hooks/useResource";
import { Button, Group, Modal } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
const CreateCarouselModal = ({
  opened,
  onClose,
}: Readonly<{ opened: boolean; onClose: () => void }>) => {
  const __ = useTranslations("Carousel.create");
  const resource = useResource();

  return (
    <Modal opened={opened} onClose={onClose} title={__("title")} size="xl">
      <form action="#">
        <DropzoneTrigger {...resource.trigger} />

        <Group mt="md">
          <Button onClick={onClose} variant="outline">
            {__("actions.cancel")}
          </Button>
          <Button
            type="submit"
            disabled={!resource.selectedResource}
            onClick={onClose}
          >
            {__("actions.create")}
          </Button>
        </Group>
      </form>
      {resource.modal}
    </Modal>
  );
};

export default CreateCarouselModal;
