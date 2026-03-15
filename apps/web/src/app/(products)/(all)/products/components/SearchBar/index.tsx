import { IconSearch } from "@pawpal/icons";
import { TextInput } from "@pawpal/ui/core";
import { useDebouncedValue } from "@pawpal/ui/hooks";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

interface SearchBarProps {
  search: string;
  onSearchChange: (search: string) => void;
}

export default function SearchBar({ search, onSearchChange }: SearchBarProps) {
  const __ = useTranslations("Products");

  // Local state for immediate UI updates
  const [localSearch, setLocalSearch] = useState(search);

  // Debounced value for API calls (500ms delay for better UX)
  const [debouncedSearch] = useDebouncedValue(localSearch, 500);

  // Update local state when external search prop changes
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // Call onSearchChange when debounced value changes
  useEffect(() => {
    onSearchChange(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
  }, []);

  return (
    <TextInput
      value={localSearch}
      onChange={handleSearch}
      placeholder={__("searchPlaceholder")}
      rightSection={<IconSearch size={16} />}
    />
  );
}
