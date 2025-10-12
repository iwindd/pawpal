import API from "@/libs/api/client";
import { AdminProductResponse } from "@pawpal/shared";
import {
  Combobox,
  ComboboxProps,
  InputBase,
  Loader,
  useCombobox,
} from "@pawpal/ui/core";
import { useDebouncedValue } from "@pawpal/ui/hooks";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { forwardRef, useEffect, useState } from "react";

interface ComboboxProductProps
  extends Omit<ComboboxProps, "children" | "store"> {
  value?: string | null;
  defaultValue?: string;
  onChange?: (value: string | null) => void;
  label?: string;
  placeholder?: string;
  error?: React.ReactNode;
  clearable?: boolean;
  required?: boolean;
  description?: string;
  disabled?: boolean;
}

const ComboboxProduct = forwardRef<HTMLInputElement, ComboboxProductProps>(
  (
    {
      value,
      onChange,
      label,
      placeholder,
      error,
      clearable = true,
      required,
      description,
      disabled,
      defaultValue,
      ...props
    },
    ref
  ) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm] = useDebouncedValue(searchTerm, 300);
    const [internalValue, setInternalValue] = useState<string | null>(null);
    const [products, setProducts] = useState<AdminProductResponse[]>([]);
    const __ = useTranslations("Combobox.product");

    const combobox = useCombobox({
      onDropdownClose: () => {
        combobox.resetSelectedOption();
        setSearchTerm("");
      },
    });

    const { data, isLoading } = useQuery({
      queryKey: ["products", debouncedSearchTerm],
      queryFn: () =>
        API.product.list({
          page: 1,
          limit: 8,
          search: debouncedSearchTerm,
        }),
    });

    const fetchProduct = async (id: string) => {
      const response = await API.product.findOne(id);

      if (!response.success || !response.data) return false;
      const product = response.data;
      setProducts((prev) => {
        if (prev.find((p) => p.id === product.id)) return prev;
        return [...prev, product];
      });

      setInternalValue(product.name);
    };

    useEffect(() => {
      if (defaultValue) {
        fetchProduct(defaultValue);
      }
    }, [defaultValue]);

    useEffect(() => {
      setInternalValue(value ?? null);
    }, [value]);

    useEffect(() => {
      if (data?.data?.data) {
        const newData = data.data.data;
        setProducts((prevDat) => {
          const ids = prevDat.map((p) => p.id);
          const filtered = newData.filter((p) => !ids.includes(p.id));
          return [...prevDat, ...filtered].sort((a, b) =>
            a.name.localeCompare(b.name)
          );
        });
      }
    }, [data]);

    const handleSelect = (val: string | null) => {
      setInternalValue(val);
      onChange?.(val);
      combobox.closeDropdown();
    };

    const selectedProduct = products.find((p) =>
      [internalValue, value].includes(p.id.toString())
    );
    const displayValue = selectedProduct?.name || internalValue || value || "";

    const options = products.map((product) => (
      <Combobox.Option
        value={product.id.toString()}
        key={product.id.toString()}
      >
        {product.name}
      </Combobox.Option>
    ));

    const rightSection = () => {
      if (isLoading) {
        return <Loader size={18} />;
      }

      if (clearable && (value || internalValue)) {
        return (
          <Combobox.ClearButton
            onClear={() => {
              onChange?.(null);
              setInternalValue(null);
              setSearchTerm("");
            }}
          />
        );
      }

      return <Combobox.Chevron />;
    };

    const optionChildren = () => {
      if (isLoading) {
        return <Combobox.Empty>{__("loading")}</Combobox.Empty>;
      }

      if (options.length > 0) {
        return options;
      }

      return <Combobox.Empty>{__("noOptions")}</Combobox.Empty>;
    };

    const inputValue = searchTerm || displayValue || "";

    return (
      <Combobox
        store={combobox}
        withinPortal={true}
        onOptionSubmit={handleSelect}
        {...props}
      >
        <Combobox.Target>
          <InputBase
            ref={ref}
            label={label || __("label")}
            placeholder={placeholder || __("placeholder")}
            error={error}
            description={description}
            required={required}
            disabled={disabled}
            value={inputValue}
            pointer
            onChange={(event) => {
              setSearchTerm(event.currentTarget.value);
              combobox.openDropdown();
              combobox.updateSelectedOptionIndex();
            }}
            onClick={() => !disabled && combobox.openDropdown()}
            onFocus={() => !disabled && combobox.openDropdown()}
            onBlur={() => {
              combobox.closeDropdown();
              setSearchTerm("");
            }}
            rightSection={rightSection()}
            rightSectionPointerEvents={
              clearable && value && !isLoading ? "all" : "none"
            }
          />
        </Combobox.Target>

        <Combobox.Dropdown>
          <Combobox.Options>{optionChildren()}</Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    );
  }
);

ComboboxProduct.displayName = "ComboboxProduct";

export default ComboboxProduct;
