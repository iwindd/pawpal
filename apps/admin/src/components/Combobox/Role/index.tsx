import {
  useLazyGetRoleQuery,
  useLazyGetRolesQuery,
} from "@/features/role/roleApi";
import { AdminRoleResponse } from "@pawpal/shared";
import { useTranslations } from "next-intl";
import { BaseCombobox, BaseComboboxProps } from "../BaseCombobox";

interface RoleComboboxProps extends Pick<
  BaseComboboxProps<AdminRoleResponse>,
  "inputProps"
> {
  value?: string | null;
  defaultValue?: string;
  onChange?: (value: string | null) => void;
}

export default function RoleCombobox(props: Readonly<RoleComboboxProps>) {
  const __ = useTranslations("Combobox.Role");
  const [getRoles] = useLazyGetRolesQuery();
  const [getRoleById] = useLazyGetRoleQuery();

  return (
    <BaseCombobox<AdminRoleResponse>
      {...props}
      fetchList={(search: string) =>
        getRoles({ page: 1, limit: 15, search })
          .unwrap()
          .then((r: { data: AdminRoleResponse[] }) => r.data)
      }
      fetchById={(id: string) => getRoleById(id).unwrap()}
      mapItem={(p: AdminRoleResponse) => ({
        id: p.id.toString(),
        label: p.name,
      })}
    />
  );
}
