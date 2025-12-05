"use client";
import { useGetCategoriesQuery } from "@/services/category";
import { AdminCategoryResponse } from "@pawpal/shared";
import {
  Combobox,
  ComboboxProps,
  InputBase,
  Loader,
  useCombobox,
} from "@pawpal/ui/core";
import { useDebouncedValue } from "@pawpal/ui/hooks";
import { forwardRef, useEffect, useState } from "react";

interface CategoryComboboxProps {
  placeholder?: string;
  label?: string;
  value?: string;
  onChange?: (value: string | null) => void;
  error?: React.ReactNode;
  withAsterisk?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  size?: ComboboxProps["size"];
}

const CategoryCombobox = forwardRef<HTMLInputElement, CategoryComboboxProps>(
  (
    {
      placeholder,
      label,
      value,
      onChange,
      error,
      withAsterisk,
      disabled,
      size,
      clearable = true,
    },
    ref
  ) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm] = useDebouncedValue(searchTerm, 300);
    const [internalValue, setInternalValue] = useState<string | null>(null);
    const [categories, setCategories] = useState<AdminCategoryResponse[]>([]);

    const combobox = useCombobox({
      onDropdownClose: () => {
        combobox.resetSelectedOption();
        setSearchTerm("");
      },
    });

    const categoriesQuery = useGetCategoriesQuery({
      search: debouncedSearchTerm,
    });

    useEffect(() => {
      if (categoriesQuery.data) {
        setCategories(categoriesQuery.data);
      }
    }, [categoriesQuery.data]);

    useEffect(() => {
      setInternalValue(value ?? null);
    }, [value]);

    const handleSelect = (val: string | null) => {
      setInternalValue(val);
      onChange?.(val);
      combobox.closeDropdown();
    };

    const selectedCategory = categories.find((cat) =>
      [internalValue, value].includes(cat.id)
    );
    const displayValue = selectedCategory?.name || internalValue || value || "";

    console.log(value);

    const options = categories.map((category) => (
      <Combobox.Option value={category.id} key={category.id}>
        {category.name}
      </Combobox.Option>
    ));

    const rightSection = () => {
      if (categoriesQuery.isLoading) {
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
      if (categoriesQuery.isLoading) {
        return <Combobox.Empty>Loading...</Combobox.Empty>;
      }

      if (options.length > 0) {
        return options;
      }

      return <Combobox.Empty>No categories found</Combobox.Empty>;
    };

    const inputValue = searchTerm || displayValue || "";

    return (
      <Combobox
        store={combobox}
        withinPortal={true}
        onOptionSubmit={handleSelect}
        disabled={disabled}
      >
        <Combobox.Target>
          <InputBase
            ref={ref}
            label={label}
            placeholder={placeholder}
            error={error}
            withAsterisk={withAsterisk}
            disabled={disabled}
            value={inputValue}
            pointer
            size={size}
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
              clearable && value && !categoriesQuery.isLoading ? "all" : "none"
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

CategoryCombobox.displayName = "CategoryCombobox";

export default CategoryCombobox;
