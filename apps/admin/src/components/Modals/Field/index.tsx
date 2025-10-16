import FieldForm, {
  FieldFormProps,
} from "@/components/Forms/ProductForm/FieldForm";
import { FieldInput } from "@pawpal/shared";
import { Modal } from "@pawpal/ui/core";

interface FieldModalProps extends FieldFormProps {
  opened: boolean;
  onClose: () => void;
  title: string;
}

const FieldModal = ({ opened, onClose, onSubmit, title }: FieldModalProps) => {
  const handleSubmit = (data: FieldInput) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Modal mb="md" size="lg" title={title} opened={opened} onClose={onClose}>
      <FieldForm onSubmit={handleSubmit} />
    </Modal>
  );
};

export default FieldModal;
