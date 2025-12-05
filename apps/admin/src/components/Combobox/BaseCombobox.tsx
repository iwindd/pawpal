import { similarity } from "@/libs/utils";
import {
  Combobox,
  ComboboxProps,
  InputBase,
  InputBaseProps,
  Loader,
  useCombobox,
} from "@pawpal/ui/core";
import { useDebouncedValue } from "@pawpal/ui/hooks";
import { useTranslations } from "next-intl";
import { forwardRef, ReactNode, useEffect, useState } from "react";

interface MappedItem {
  id: string;
  label: string;
}

export interface BaseComboboxProps<T> extends Omit<
  ComboboxProps,
  "children" | "store"
> {
  value?: string | null;
  defaultValue?: string;
  onChange?: (value: string | null) => void;

  fetchList: (search: string) => Promise<T[]>;
  fetchById?: (id: string) => Promise<T | null>;
  mapItem: (item: T) => MappedItem;
  similaritySort?: (item: MappedItem, search: string) => number;

  clearable?: boolean;
  inputProps?: InputBaseProps & {
    placeholder?: string;
  };
}

const BaseComboboxInner = <T,>(
  {
    value,
    defaultValue,
    onChange,
    fetchList,
    fetchById,
    mapItem,
    inputProps,
    clearable = true,
    disabled,
    similaritySort,
    ...props
  }: BaseComboboxProps<T>,
  ref: React.Ref<HTMLInputElement>
) => {
  similaritySort =
    similaritySort || ((item, search) => similarity(item.label, search));

  const __ = useTranslations("Combobox.base");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebouncedValue(searchTerm, 300);

  const [items, setItems] = useState<MappedItem[]>([]);
  const [internalValue, setInternalValue] = useState<string | null>(null);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingById, setLoadingById] = useState(false);

  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      setSearchTerm("");
    },
  });

  /** 1) Fetch list by search term */
  useEffect(() => {
    let mounted = true;

    setLoadingList(true);
    fetchList(debouncedSearchTerm)
      .then((data) => {
        if (!mounted) return;

        const mapped = data.map(mapItem);
        setItems((prev) => {
          const ids = new Set(prev.map((i) => i.id));
          const filtered = mapped.filter((i) => !ids.has(i.id));
          return [...prev, ...filtered];
        });
      })
      .finally(() => mounted && setLoadingList(false));

    return () => {
      mounted = false;
    };
  }, [debouncedSearchTerm]);

  /** 2) Fetch defaultValue (id) */
  useEffect(() => {
    if (!defaultValue || !fetchById) return;

    setLoadingById(true);
    fetchById(defaultValue)
      .then((item) => {
        if (!item) return;
        const mapped = mapItem(item);
        setItems((prev) => {
          if (prev.some((p) => p.id === mapped.id)) return prev;
          return [...prev, mapped];
        });
        setInternalValue(mapped.id);
      })
      .finally(() => setLoadingById(false));
  }, [defaultValue]);

  /** 3) Sync external value */
  useEffect(() => {
    setInternalValue(value ?? null);
  }, [value]);

  const handleSelect = (val: string | null) => {
    setInternalValue(val);
    onChange?.(val);
    combobox.closeDropdown();
  };

  const selected = items.find((i) => [internalValue, value].includes(i.id));
  const displayValue = selected?.label || "";
  const sortedItems = [...items]
    .sort((a, b) => {
      if (!similaritySort) return a.label.localeCompare(b.label);

      const scoreA = similaritySort(a, debouncedSearchTerm);
      const scoreB = similaritySort(b, debouncedSearchTerm);

      // เรียงจากมาก → น้อย
      return scoreB - scoreA;
    })
    .slice(0, 5);

  const options = sortedItems.map((item) => (
    <Combobox.Option value={item.id} key={item.id}>
      {item.label}
    </Combobox.Option>
  ));

  const rightSection = () => {
    if (loadingList || loadingById) return <Loader size={18} />;

    if (clearable && (value || internalValue))
      return (
        <Combobox.ClearButton
          onClear={() => {
            setInternalValue(null);
            onChange?.(null);
            setSearchTerm("");
          }}
        />
      );

    return <Combobox.Chevron />;
  };

  const optionChildren = () => {
    if (loadingList) return <Combobox.Empty>{__("loading")}</Combobox.Empty>;
    if (options.length > 0) return options;
    return <Combobox.Empty>{__("noOptions")}</Combobox.Empty>;
  };

  const inputValue = searchTerm || displayValue;

  return (
    <Combobox
      store={combobox}
      withinPortal
      onOptionSubmit={handleSelect}
      {...props}
    >
      <Combobox.Target>
        <InputBase
          pointer
          {...inputProps}
          ref={ref}
          value={inputValue}
          onChange={(e) => {
            setSearchTerm(e.currentTarget.value);
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
            clearable && value && !loadingList ? "all" : "none"
          }
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>{optionChildren()}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};

export const BaseCombobox = forwardRef(BaseComboboxInner) as <T>(
  props: BaseComboboxProps<T> & { ref?: React.Ref<HTMLInputElement> }
) => ReactNode;
