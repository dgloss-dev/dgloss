'use client';
import React from 'react';
import { Button, ButtonVariant } from '@workspace/ui/components/atoms/button';
import { Icon } from '@workspace/ui/components/atoms/icon/icon';
import { iconMap } from '@workspace/ui/icons/iconMap';
import { ImageIcon } from '@workspace/ui/components/atoms/icon/imageIcon';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { OPERATOR_STATE } from '@workspace/types/enums/operatorStatus/operatorState.enum';

interface TopPageHeaderProps {
  status: OPERATOR_STATE;
  className?: string;
  faqRoute: string;
}

export const TopPageHeader: React.FC<TopPageHeaderProps> = ({ status, className, faqRoute }) => {
  const sharedButtonClasses = '!w-full !max-w-[96px] !text-[14px] !font-bold rounded-[6px]';
  const router = useRouter();
  const t = useTranslations('common');
  const handleStatusChange = (type: OPERATOR_STATE) => {
    console.log(type);
  };
  const handleFaqClick = () => {
    router.push(faqRoute);
  };

  const getStatusButtonProps = (
    type: OPERATOR_STATE,
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
    <div className={`flex items-center justify-end w-full gap-x-[10px] px-4 h-20`}>
      <div className="flex items-center">
        <Button
          {...getStatusButtonProps(
            OPERATOR_STATE.SEATED,
            'Seated',
            t('buttons.seated'),
            '!rounded-r-none',
          )}
        />
        <Button
          {...getStatusButtonProps(
            OPERATOR_STATE.AWAY,
            'Prohibited',
            t('buttons.away'),
            '!rounded-l-none',
          )}
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
