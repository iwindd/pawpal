"use client";

import { useGetRolesQuery } from "@/features/role/roleApi";
import { useCreateUserMutation } from "@/features/user/userApi";
import useFormValidate from "@/hooks/useFormValidate";
import { IconDeviceFloppy } from "@pawpal/icons";
import { AdminCreateUserInput, adminCreateUserSchema } from "@pawpal/shared";
import {
  Button,
  Card,
  Group,
  MultiSelect,
  PasswordInput,
  Select,
  Stack,
  Text,
  TextInput,
} from "@pawpal/ui/core";
import { notify } from "@pawpal/ui/notifications";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function CreateUserForm({
  defaultType = "customer",
}: {
  defaultType?: "customer" | "employee";
}) {
  const __ = useTranslations("CreateUser");
  const router = useRouter();
  const [createUser, { isLoading, error }] = useCreateUserMutation();
  const { data: roles } = useGetRolesQuery({
    page: 1,
    limit: 100,
  });

  const form = useFormValidate({
    schema: adminCreateUserSchema,
    initialValues: {
      displayName: "",
      email: "",
      password: "",
      password_confirmation: "",
      type: defaultType,
      roles: [] as string[],
    },
  });

  const userType = form.getValues().type;

  const handleSubmit = async (values: AdminCreateUserInput) => {
    const res = await createUser(values);
    if (!("error" in res)) {
      notify.show({
        color: "green",
        message: __("notify.createSuccess"),
      });
      if (values.type === "employee") {
        router.push("/users/employees");
      } else {
        router.push("/users/customers");
      }
    }
  };

  const roleOptions = (roles?.data ?? []).map((role) => ({
    value: role.name,
    label: role.name,
  }));

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <Card>
          <Card.Header title={__("sections.account")} />
          <Card.Content>
            <Stack>
              <TextInput
                label={__("displayName.label")}
                placeholder={__("displayName.placeholder")}
                required
                key={form.key("displayName")}
                {...form.getInputProps("displayName")}
              />
              <TextInput
                label={__("email.label")}
                placeholder={__("email.placeholder")}
                required
                key={form.key("email")}
                {...form.getInputProps("email")}
              />
              <PasswordInput
                label={__("password.label")}
                placeholder={__("password.placeholder")}
                required
                key={form.key("password")}
                {...form.getInputProps("password")}
              />
              <PasswordInput
                label={__("passwordConfirmation.label")}
                placeholder={__("passwordConfirmation.placeholder")}
                required
                key={form.key("password_confirmation")}
                {...form.getInputProps("password_confirmation")}
              />
            </Stack>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header
            title={__("sections.type")}
            subtitle={__("sections.typeDescription")}
          />
          <Card.Content>
            <Stack>
              <Select
                label={__("type.label")}
                data={[
                  { value: "customer", label: __("type.customer") },
                  { value: "employee", label: __("type.employee") },
                ]}
                required
                key={form.key("type")}
                {...form.getInputProps("type")}
                onChange={(value) => {
                  form.setFieldValue("type", value as "customer" | "employee");
                  if (value === "customer") {
                    form.setFieldValue("roles", []);
                  }
                }}
              />

              {userType === "employee" && (
                <MultiSelect
                  label={__("roles.label")}
                  placeholder={__("roles.placeholder")}
                  data={roleOptions}
                  searchable
                  key={form.key("roles")}
                  {...form.getInputProps("roles")}
                />
              )}
            </Stack>
          </Card.Content>
        </Card>

        {error && (
          <Text c="red" size="sm">
            {__("notify.createError")}
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
