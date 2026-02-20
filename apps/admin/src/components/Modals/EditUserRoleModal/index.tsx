"use client";
import RoleCombobox from "@/components/Combobox/Role";
import { useUpdateUserRolesMutation } from "@/features/user/userApi";
import useFormValidate from "@/hooks/useFormValidate";
import {
  AdminUpdateUserRoleInput,
  adminUpdateUserRoleSchema,
} from "@pawpal/shared";
import { Button, Group, Modal, Select } from "@pawpal/ui/core";
import { notify } from "@pawpal/ui/notifications";
import { useTranslations } from "next-intl";

interface EditUserRoleModalProps {
  userId: string | null;
  initialType: "customer" | "employee";
  initialRoles: string[];
  opened: boolean;
  onClose: () => void;
}

const EditUserRoleModal = ({
  userId,
  initialType,
  initialRoles,
  opened,
  onClose,
}: EditUserRoleModalProps) => {
  const __ = useTranslations("User.EditUserRoleModal");
  const [updateUserRoles, { isLoading }] = useUpdateUserRolesMutation();

  const form = useFormValidate({
    schema: adminUpdateUserRoleSchema,
    initialValues: {
      type: initialType,
      roles: initialRoles,
    },
  });

  const selectedType = form.values.type;

  /*   useEffect(() => { TODO:: Implement
    if (opened && userId) {
      form.setValues({
        type: initialType,
        roles: initialRoles,
      });
    }
  }, [opened, userId, initialType, initialRoles, form]);
 */
  const handleSubmit = async (values: AdminUpdateUserRoleInput) => {
    if (!userId) return;

    try {
      /*       await updateUserRoles({
        id: userId,
        payload: {
          type: values.type,
          roles: values.type === "employee" ? values.roles : [],
        },
      }).unwrap(); 
      
      TODO:: Implement
      */

      notify.show({
        color: "green",
        message: __("notify.success.message"),
      });

      onClose();
    } catch {
      notify.show({
        color: "red",
        message: __("notify.error.message"),
      });
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title={__("title")} centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Select
          label={__("type.label")}
          placeholder={__("type.placeholder")}
          data={[
            { label: __("type.options.customer"), value: "customer" },
            { label: __("type.options.employee"), value: "employee" },
          ]}
          value={selectedType}
          onChange={(val) => {
            if (val) {
              form.setFieldValue("type", val as "customer" | "employee");
              if (val === "customer") {
                form.setFieldValue("roles", []);
              }
            }
          }}
          required
          mb="md"
        />

        {selectedType === "employee" && (
          <RoleCombobox
            inputProps={{
              label: __("roles.label"),
              placeholder: __("roles.placeholder"),
              required: true,
              error: form.errors.roles as string,
            }}
            value={form.values.roles[0] ?? null}
            onChange={(val) => form.setFieldValue("roles", val ? [val] : [])}
          />
        )}

        <Group justify="flex-end" mt="md">
          <Button type="submit" loading={isLoading}>
            {__("submit")}
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default EditUserRoleModal;
