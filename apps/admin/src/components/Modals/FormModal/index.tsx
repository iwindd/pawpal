import { Modal } from "@pawpal/ui/core";

interface FormModalProps {
  form: React.ReactNode;
  opened: boolean;
  onClose: () => void;
  title: string;
}

const FormModal = ({ form, opened, onClose, title }: FormModalProps) => {
  return (
    <Modal opened={opened} onClose={onClose} title={title}>
      {form}
    </Modal>
  );
};

export default FormModal;
