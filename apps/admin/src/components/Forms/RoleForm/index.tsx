"use client";

import { useGetPermissionsQuery } from "@/features/role/roleApi";
import useFormValidate from "@/hooks/useFormValidate";
import { IconDeviceFloppy } from "@pawpal/icons";
import { RoleInput, roleSchema } from "@pawpal/shared";
import {
  Button,
  Card,
  Grid,
  Group,
  Skeleton,
  Stack,
  Switch,
  Text,
  TextInput,
  Textarea,
} from "@pawpal/ui/core";
import { randomId } from "@pawpal/ui/hooks";
import { useTranslations } from "next-intl";

interface RoleFormProps {
  initialValues?: Partial<RoleInput>;
  onSubmit: (values: RoleInput) => void;
  isLoading?: boolean;
  errorMessage?: string | null;
}

export default function RoleForm({
  initialValues,
  onSubmit,
  isLoading,
  errorMessage,
}: RoleFormProps) {
  const __ = useTranslations("Role.form");
  const __p = useTranslations("Permission");

  const form = useFormValidate<RoleInput>({
    schema: roleSchema,
    initialValues: {
      name: "",
      description: "",
      permissions: [],
      ...initialValues,
    },
    mode: "controlled",
  });

  const { data: permissions, isLoading: permissionsLoading } =
    useGetPermissionsQuery();

  const currentPermissions = form.getValues().permissions;

  const handlePermissionToggle = (permissionName: string, checked: boolean) => {
    const current = form.getValues().permissions;
    if (checked) {
      form.setFieldValue("permissions", [...current, permissionName]);
    } else {
      form.setFieldValue(
        "permissions",
        current.filter((p) => p !== permissionName),
      );
    }
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack>
        <Card>
          <Card.Header title={__("sections.general")} />
          <Card.Content>
            <Stack>
              <TextInput
                label={__("name.label")}
                placeholder={__("name.placeholder")}
                required
                key={form.key("name")}
                {...form.getInputProps("name")}
              />
              <Textarea
                label={__("description.label")}
                placeholder={__("description.placeholder")}
                autosize
                minRows={2}
                maxRows={4}
                key={form.key("description")}
                {...form.getInputProps("description")}
              />
            </Stack>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header
            title={__("sections.permissions")}
            subtitle={__("sections.permissionsDescription")}
          />
          <Card.Content>
            <Grid gutter="lg">
              {permissionsLoading ? (
                <>
                  {Array.from({ length: 15 }).map((_, i) => (
                    <Grid.Col span={4} key={randomId()}>
                      <Skeleton height={40} radius="sm" />
                    </Grid.Col>
                  ))}
                </>
              ) : (
                <>
                  {permissions
                    ?.filter((p) => p.name !== "*.*")
                    .map((permission) => (
                      <Grid.Col span={4} key={permission.id}>
                        <Switch
                          label={__p(`${permission.name}.label`)}
                          description={__p(`${permission.name}.description`)}
                          checked={currentPermissions.includes(permission.name)}
                          onChange={(event) =>
                            handlePermissionToggle(
                              permission.name,
                              event.currentTarget.checked,
                            )
                          }
                        />
                      </Grid.Col>
                    ))}
                </>
              )}
            </Grid>
          </Card.Content>
        </Card>

        {errorMessage && (
          <Text c="red" size="sm">
            {errorMessage}
          </Text>
        )}

        <Group justify="flex-end">
          <Button
            type="submit"
            color="success"
            leftSection={<IconDeviceFloppy size={14} />}
            loading={isLoading}
          >
            {__("actions.save")}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
