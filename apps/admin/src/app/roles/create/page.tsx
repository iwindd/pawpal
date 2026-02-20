"use client";
import RoleForm from "@/components/Forms/RoleForm";
import PageHeader from "@/components/Pages/PageHeader";
import { useCreateRoleMutation } from "@/features/role/roleApi";
import { RoleInput } from "@pawpal/shared";
import { notify } from "@pawpal/ui/notifications";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function CreateRolePage() {
  const __ = useTranslations("Role");
  const router = useRouter();
  const [createRole, { isLoading, error }] = useCreateRoleMutation();

  const handleSubmit = async (values: RoleInput) => {
    const res = await createRole(values);
    if (!("error" in res)) {
      notify.show({
        color: "green",
        message: __("notify.createSuccess"),
      });
      router.push("/roles");
    }
  };

  return (
    <main>
      <PageHeader title={__("create.title")} />
      <RoleForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        errorMessage={error ? __("notify.createError") : null}
      />
    </main>
  );
}
