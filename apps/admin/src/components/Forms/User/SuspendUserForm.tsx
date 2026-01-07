"use client";
import { Button, Group, Stack, Textarea } from "@pawpal/ui/core";
import { useForm } from "@pawpal/ui/form";
import { useTranslations } from "next-intl";

interface SuspendUserFormProps {
  onSubmit: (values: { note?: string }) => void;
  loading?: boolean;
}

export default function SuspendUserForm({
  onSubmit,
  loading,
}: Readonly<SuspendUserFormProps>) {
  const __ = useTranslations("User.SuspendUserModal");
  const form = useForm({
    initialValues: {
      note: "",
    },
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack gap="md">
        <Textarea
          label={__("note.label")}
          placeholder={__("note.placeholder")}
          {...form.getInputProps("note")}
        />
        <Group justify="flex-end">
          <Button type="submit" loading={loading} color="red">
            {__("submit")}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
