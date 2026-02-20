"use client";
import RoleForm from "@/components/Forms/RoleForm";
import PageHeader from "@/components/Pages/PageHeader";
import {
  useGetRoleQuery,
  useUpdateRoleMutation,
} from "@/features/role/roleApi";
import { RoleInput } from "@pawpal/shared";
import { Skeleton, Stack } from "@pawpal/ui/core";
import { notify } from "@pawpal/ui/notifications";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export default function EditRolePage() {
  const { id } = useParams<{ id: string }>();
  const __ = useTranslations("Role");
  const { data: role, isLoading: roleLoading } = useGetRoleQuery(id);
  const [updateRole, { isLoading: updating, error }] = useUpdateRoleMutation();

  const handleSubmit = async (values: RoleInput) => {
    const res = await updateRole({ id, body: values });
    if (!("error" in res)) {
      notify.show({
        color: "green",
        message: __("notify.updateSuccess"),
      });
    }
  };

  if (roleLoading) {
    return (
      <main>
        <PageHeader title={__("edit.title")} />
        <Stack gap="md">
          <Skeleton height={200} radius="sm" />
          <Skeleton height={300} radius="sm" />
        </Stack>
      </main>
    );
  }

  if (!role) return null;

  return (
    <main>
      <PageHeader title={role.name} />
      <RoleForm
        initialValues={{
          name: role.name,
          description: role.description ?? "",
          permissions: role.permissions.map((p) => p.name),
        }}
        onSubmit={handleSubmit}
        isLoading={updating}
        errorMessage={error ? __("notify.updateError") : null}
      />
    </main>
  );
}
