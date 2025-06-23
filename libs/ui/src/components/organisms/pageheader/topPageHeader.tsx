'use client';
import React from 'react';
import { Button, ButtonVariant } from '../../atoms/button';
import { Icon } from '../../atoms/icon/icon';
import { iconMap } from '@workspace/ui/icons/iconMap';
import { ImageIcon } from '../../atoms/icon/imageIcon';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export type OperatorStatus = 'seated' | 'away'; // need to update according to real types;

interface TopPageHeaderProps {
  status: OperatorStatus;
  className?: string;
  faqRoute: string;
}

export const TopPageHeader: React.FC<TopPageHeaderProps> = ({ status, className, faqRoute }) => {
  const sharedButtonClasses = '!w-full !max-w-[96px] !text-[14px] !font-bold rounded-[6px]';
  const router = useRouter();
  const t = useTranslations('common');
  const handleStatusChange = (type: OperatorStatus) => {
    console.log(type);
  };
  const handleFaqClick = () => {
    router.push(faqRoute);
  };

  const getStatusButtonProps = (
    type: OperatorStatus,
    iconName: keyof typeof iconMap,
    label: string,
    roundedClass: string,
  ) => {
    const isActive = status === type;

    return {
      variant: (isActive ? 'primary' : 'primary-outline') as ButtonVariant,
      icon: (
        <Icon
          name={iconName}
          size={16}
          className={`${isActive ? '!text-white' : '!text-overlay'} mt-1`}
        />
      ),
      label,
      onClick: () => handleStatusChange(type),
      customClass: [
        sharedButtonClasses,
        roundedClass,
        '!border',
        type === 'away' && '!border-dust',
        isActive ? '!text-white' : '!text-overlay',
      ]
        .filter(Boolean)
        .join(' '),
    };
  };

  return (
    <div
      className={`flex items-center justify-end w-full gap-x-[10px] px-4 h-20`}
    >
      <div className="flex items-center">
        <Button
          {...getStatusButtonProps('seated', 'Seated', t('buttons.seated'), '!rounded-r-none')}
        />
        <Button
          {...getStatusButtonProps('away', 'Prohibited', t('buttons.away'), '!rounded-l-none')}
        />
      </div>
      <Button
        variant="primary-outline"
        icon={<ImageIcon className="!max-w-none" path="header/faq.svg" />}
        label={`${t('buttons.faq')}`}
        onClick={handleFaqClick}
        className="w-[80px]"
      />
    </div>
  );
};
