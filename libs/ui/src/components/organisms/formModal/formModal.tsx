import { Modal } from '../../molecules/modal';

interface FormModalProps {
  open: boolean;
  onCancel: () => void;
  formComponent: React.ReactNode;
  title: string;
}

export const FormModal = ({ open, onCancel, formComponent, title }: FormModalProps) => {
  return (
    <Modal title={title} showFooter={true} open={open} onCancel={onCancel}>
      <div className="w-full h-full ">{formComponent}</div>
    </Modal>
  );
};
