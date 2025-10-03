"use client";
import useFormValidate from "@/hooks/useFormValidate";
import API from "@/libs/api/client";
import { IconUpload } from "@pawpal/icons";
import { ResourceUploadInput, resourceUploadSchema } from "@pawpal/shared";
import {
  Button,
  ErrorMessage,
  FileInput,
  Group,
  Modal,
  Stack,
  Text,
} from "@pawpal/ui/core";
import { notify } from "@pawpal/ui/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";

interface UploadImageModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function UploadImageModal({
  opened,
  onClose,
}: Readonly<UploadImageModalProps>) {
  const __ = useTranslations("Resources.UploadModal");
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const revokeRef = useRef<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      revokeRef.current = url;
    }
    return () => {
      if (revokeRef.current) {
        URL.revokeObjectURL(revokeRef.current);
        revokeRef.current = null;
      }
    };
  }, [file]);

  const canSubmit = useMemo(() => Boolean(file), [file]);

  const form = useFormValidate<ResourceUploadInput>({
    schema: resourceUploadSchema,
    group: "resource",
    onValuesChange: ({ file }) => {
      setFile(file as any);
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!file) return;
      const formData = new FormData();
      formData.append("file", file);
      return await API.resource.upload(formData);
    },
    onSuccess: () => {
      notify.show({
        title: __("notify.success.title"),
        message: __("notify.success.message"),
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      handleClose();
    },
    onError: () => {
      setMessage("error");
    },
  });

  const onSubmit = async (values: ResourceUploadInput) => {
    setFile(values.file);
    mutate();
  };

  const handleClose = () => {
    setFile(null);
    setPreviewUrl(null);
    onClose();
  };

  return (
    <Modal opened={opened} onClose={handleClose} title={__("title")} centered>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap="xs">
          {previewUrl && (
            <img
              src={previewUrl}
              alt="preview"
              style={{
                width: "100%",
                maxHeight: 240,
                objectFit: "contain",
                borderRadius: 8,
              }}
            />
          )}
          <FileInput
            placeholder={__("filePlaceholder")}
            leftSection={<IconUpload size={16} />}
            key={form.getInputProps("file").value}
            {...form.getInputProps("file")}
          />
          {!file && (
            <Text c="dimmed" size="sm">
              {__("hint")}
            </Text>
          )}
          <Group justify="flex-end">
            <Button
              variant="default"
              onClick={handleClose}
              disabled={isPending}
            >
              {__("cancel")}
            </Button>
            <Button type="submit" disabled={!canSubmit} loading={isPending}>
              {__("upload")}
            </Button>
          </Group>
          {message && (
            <ErrorMessage
              align="end"
              message={message}
              formatGroup="Resources.UploadModal"
            />
          )}
        </Stack>
      </form>
    </Modal>
  );
}
