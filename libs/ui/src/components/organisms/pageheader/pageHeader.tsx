import React from 'react';
import { Button, ButtonVariant } from '../../atoms/button';
import { Icon } from '../../atoms/icon/icon';
import { iconMap } from '@workspace/ui/icons/iconMap';
import { ImageIcon } from '../../atoms/icon/imageIcon';

export type OperatorStatus = 'seated' | 'away' // need to update according to real types;

interface PageHeaderProps {
  status: OperatorStatus;
  onStatusChange: (status: OperatorStatus) => void;
  onFaqClick: () => void;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  status,
  onStatusChange,
  onFaqClick,
  className,
}) => {
  const sharedButtonClasses = '!w-full !max-w-[96px] !text-[14px] !font-bold rounded-[6px]';

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
      onClick: () => onStatusChange(type),
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
    <div className={`flex items-center justify-end w-full gap-x-[10px] ${className || ''}`}>
      <div className="flex items-center">
        <Button {...getStatusButtonProps('seated', 'Seated', '着座中', '!rounded-r-none')} />
        <Button {...getStatusButtonProps('away', 'Prohibited', '離席中', '!rounded-l-none')} />
      </div>
      <Button
        variant="primary-outline"
        icon={<ImageIcon className="!max-w-none" path="header/faq.svg" />}
        label="FAQ"
        onClick={onFaqClick}
        className="w-[80px]"
      />
    </div>
  );
};
