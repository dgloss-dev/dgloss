'use client';
import { Modal } from '../../molecules/modal';
import { useAppStore } from '@client/store/app.store';

interface FormModalProps {
  modalKey: string;
  onCancel?: () => void;
  formComponent: React.ReactNode;
  title: string;
}

export const FormModal = ({ modalKey, onCancel, formComponent, title }: FormModalProps) => {
  const { openModals, setOpenModalAction } = useAppStore();
  const handleCancel = () => {
    setOpenModalAction(modalKey, false);
    onCancel?.();
  };
  return (
    <Modal title={title} showFooter={false} open={openModals[modalKey]} onCancel={handleCancel}>
      <div className="w-full h-full ">{formComponent}</div>
    </Modal>
  );
};
