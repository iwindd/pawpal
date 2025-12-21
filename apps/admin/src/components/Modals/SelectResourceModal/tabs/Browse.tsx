import ResourceDatatable from "@/components/Datatables/Resource";
import { AdminResourceResponse } from "@pawpal/shared";
import { Button } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { SelectResourceModalFooter, SelectResourceTabProps } from "..";

interface BrowseTabProps extends SelectResourceTabProps {}

const BrowseTab = ({ onSubmit, onClose }: BrowseTabProps) => {
  const [selected, setSelected] = useState<AdminResourceResponse[]>([]);
  const __ = useTranslations("Resources.modal");

  const handleSelectedRecordsChange = (
    selectedRecords: AdminResourceResponse[]
  ) => {
    setSelected(selectedRecords);
  };

  return (
    <>
      <ResourceDatatable
        onSelectedRecordsChange={handleSelectedRecordsChange}
      />

      <SelectResourceModalFooter onClose={onClose} selected={selected}>
        <Button onClick={() => onSubmit?.(selected)}>
          {__("actions.select")}
        </Button>
      </SelectResourceModalFooter>
    </>
  );
};

export default BrowseTab;
