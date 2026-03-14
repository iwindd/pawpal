import { IconSearch } from "@pawpal/icons";
import { TextInput } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import { useCallback } from "react";

interface SearchBarProps {
  search: string;
  onSearchChange: (search: string) => void;
}

export default function SearchBar({ search, onSearchChange }: SearchBarProps) {
  const __ = useTranslations("Products");

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSearchChange(e.target.value);
    },
    [onSearchChange],
  );

  return (
    <TextInput
      value={search}
      onChange={handleSearch}
      placeholder={__("searchPlaceholder")}
      rightSection={<IconSearch size={16} />}
    />
  );
}
