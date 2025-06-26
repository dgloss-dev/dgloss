'use client';
import { Modal } from '@workspace/ui/components/molecules/modal';
import { useAppStore } from '@client/store/app.store';
import { useTranslations } from 'next-intl';

interface FormModalProps {
  modalKey: string;
  onCancel?: () => void;
  formComponent: React.ReactNode;
  titleKey: string;
}

export const FormModal = ({ modalKey, onCancel, formComponent, titleKey }: FormModalProps) => {
  const { openModals, setOpenModalAction } = useAppStore();
  const handleCancel = () => {
    setOpenModalAction(modalKey, false);
    onCancel?.();
  };
  const common = useTranslations('common');
  const title = common(`form.${titleKey}`);
  return (
    <Modal title={title} showFooter={false} open={openModals[modalKey]} onCancel={handleCancel}>
      <div className="w-full h-full ">{formComponent}</div>
    </Modal>
  );
};
