import {
  useLazyGetCategoriesQuery,
  useLazyGetCategoryQuery,
} from "@/services/category";
import { AdminCategoryResponse } from "@pawpal/shared";
import { useTranslations } from "next-intl";
import { BaseCombobox, BaseComboboxProps } from "../BaseCombobox";

interface CategoryComboboxProps extends Pick<
  BaseComboboxProps<AdminCategoryResponse>,
  "inputProps"
> {
  value?: string | null;
  defaultValue?: string;
  onChange?: (value: string | null) => void;
}

export default function CategoryCombobox(
  props: Readonly<CategoryComboboxProps>
) {
  const __ = useTranslations("Combobox.Category");
  const [getCategories] = useLazyGetCategoriesQuery();
  const [getCategoryById] = useLazyGetCategoryQuery();

  return (
    <BaseCombobox<AdminCategoryResponse>
      {...props}
      fetchList={(search: string) =>
        getCategories({ page: 1, limit: 8, search })
          .unwrap()
          .then((r) => r)
      }
      fetchById={(id: string) => getCategoryById(id).unwrap()}
      mapItem={(p: AdminCategoryResponse) => ({
        id: p.id.toString(),
        label: p.name,
      })}
    />
  );
}
