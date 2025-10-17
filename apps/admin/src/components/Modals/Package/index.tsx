import PackageForm, {
  PackageFormProps,
} from "@/components/Forms/ProductForm/PackageForm";
import { PackageInput } from "@pawpal/shared";
import { Button, Modal } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";

interface PackageModalProps extends PackageFormProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  isLoading?: boolean;
}

const PackageModal = ({
  opened,
  onClose,
  onSubmit,
  title,
  ...props
}: PackageModalProps) => {
  const __ = useTranslations("ProductPackage");
  const handleSubmit = (data: PackageInput) => {
    onSubmit(data);
  };

  return (
    <Modal size="md" title={title} opened={opened} onClose={onClose}>
      <PackageForm
        onSubmit={handleSubmit}
        actionSection={
          <Button
            variant="transparent"
            disabled={props.isLoading}
            color="secondary"
            onClick={onClose}
          >
            {__("form.actions.cancel")}
          </Button>
        }
        {...props}
      />
    </Modal>
  );
};

export default PackageModal;
