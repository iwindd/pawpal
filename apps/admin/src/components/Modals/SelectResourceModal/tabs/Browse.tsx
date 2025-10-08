import ResourceDatatable from "@/components/Datatables/Resource";
import {ResourceResponse} from '@pawpal/shared';

interface BrowseTabProps {
  onSelectedRecordsChange: (selectedRecords: ResourceResponse[]) => void;
}

const BrowseTab = ({ onSelectedRecordsChange }: BrowseTabProps) => {
  return (
    <div>
      <ResourceDatatable onSelectedRecordsChange={onSelectedRecordsChange} />
    </div>
  );
};

export default BrowseTab;
