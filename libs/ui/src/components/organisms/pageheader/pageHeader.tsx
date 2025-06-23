'use client';
import { Breadcrumb } from '../../atoms/breadcrumb';
import { Button } from '../../atoms/button';
import { ImageIcon } from '../../atoms/icon';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@client/store/app.store';
interface PageHeaderProps {
  titleKey: string;
  buttonLabelKey: string;
  modalKey: string;
  breadcrumbItems: {
    title: string;
    href: string;
  }[];
}

export const PageHeader = ({
  titleKey = 'アカウント一覧',
  buttonLabelKey = 'label',
  breadcrumbItems,
  modalKey,
}: PageHeaderProps) => {
  const t = useTranslations('common');
  const title = t(`headers.${titleKey}`);
  const buttonLabel = t(`buttons.${buttonLabelKey}`);
  const { setOpenModalAction } = useAppStore();

  const handleAdd = () => {
    setOpenModalAction(modalKey, true);
  };
  return (
    <section className="w-full flex items-center justify-between h-20">
      <div className="flex flex-col items-start w-full ">
        <Breadcrumb items={breadcrumbItems} />
        <h1 className="text-2xl font-sf-pro font-bold text-base">{title}</h1>
      </div>
      {buttonLabel && (
        <div className="flex items-center justify-center gap-2">
          <Button
            icon={<ImageIcon path="actions/add.svg" alt="add" />}
            variant="primary"
            label={buttonLabel}
            className="!w-[108px]"
            onClick={handleAdd}
          />
        </div>
      )}
    </section>
  );
};
