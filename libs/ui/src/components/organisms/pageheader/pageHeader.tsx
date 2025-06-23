'use client';
import { Breadcrumb } from '../../atoms/breadcrumb';
import { Button } from '../../atoms/button';
import { ImageIcon } from '../../atoms/icon';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
interface PageHeaderProps {
  titleKey: string;
  buttonLabelKey: string;
  addRoute: string;
  breadcrumbItems: {
    title: string;
    href: string;
  }[];
}

export const PageHeader = ({
  titleKey = 'アカウント一覧',
  buttonLabelKey = 'label',
  breadcrumbItems,
  addRoute,
}: PageHeaderProps) => {
  const t = useTranslations('common');
  const router = useRouter();
  const title = t(`headers.${titleKey}`);
  const buttonLabel = t(`buttons.${buttonLabelKey}`);
  const handleAdd = () => {
    router.push(addRoute);
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
