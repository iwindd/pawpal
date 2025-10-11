import { IconSearch } from "@pawpal/icons";
import { TextInput, TextInputProps } from "@pawpal/ui/core";
import { useDebouncedValue } from "@pawpal/ui/hooks";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface Props extends Omit<TextInputProps, "onChange" | "value"> {
  onSearch?: (value: string) => void;
}

const TableSearch = ({ onSearch, ...props }: Props) => {
  const [search, setSearch] = useState<string>("");
  const __ = useTranslations("Datatable.Search");
  const [debouncedSearch] = useDebouncedValue(search, 300);

  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedSearch);
    }
  }, [debouncedSearch, onSearch]);

  return (
    <TextInput
      leftSection={<IconSearch size={16} />}
      placeholder={__("placeholder")}
      {...props}
      value={search}
      onChange={(e) => setSearch(e.currentTarget.value)}
    />
  );
};

export default TableSearch;
