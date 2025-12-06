import {
  useLazyGetProductQuery,
  useLazyGetProductsQuery,
} from "@/features/productApi/productApi";
import { AdminProductResponse } from "@pawpal/shared";
import { BaseCombobox, BaseComboboxProps } from "../BaseCombobox";

interface ProductComboboxProps extends Pick<
  BaseComboboxProps<AdminProductResponse>,
  "inputProps"
> {
  value?: string | null;
  defaultValue?: string;
  onChange?: (value: string | null) => void;
}

export default function ProductCombobox(props: Readonly<ProductComboboxProps>) {
  const [getProducts] = useLazyGetProductsQuery();
  const [getProductById] = useLazyGetProductQuery();

  return (
    <BaseCombobox<AdminProductResponse>
      {...props}
      fetchList={(search: string) =>
        getProducts({ page: 1, limit: 8, search })
          .unwrap()
          .then((r) => r.data)
      }
      fetchById={(id: string) => getProductById(id).unwrap()}
      mapItem={(p: AdminProductResponse) => ({
        id: p.id.toString(),
        label: p.name,
      })}
    />
  );
}
