'use client';
import React from 'react';
import Image from 'next/image';
import { FallbackImage } from '../fallbackImage';
import { Icon } from '../icon/icon';
import { iconMap } from '@workspace/ui/icons/iconMap';

type ButtonVariation = 'primary' | 'gray' | 'white' | 'transparent' | 'border';
type ButtonType = 'image' | 'icon';

interface BaseButtonProps {
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variations?: ButtonVariation;
  disabled?: boolean;
  ariaLabel: string;
  testId?: string;
}

interface ImageButtonProps extends BaseButtonProps {
  type: 'image';
  imageSrc: string;
  icon?: never;
}

interface IconButtonProps extends BaseButtonProps {
  type: 'icon';
  icon: keyof typeof iconMap;
  imageSrc?: never;
}

type CombinedButtonProps = ImageButtonProps | IconButtonProps;

const VARIATION_STYLES: Record<ButtonVariation, { background: string; color: string }> = {
  primary: {
    background: '!bg-primary',
    color: 'var(--color-base-light)',
  },
  white: {
    background: 'bg-white !border-[2px] !border-base-10',
    color: 'var(--color-base-dark)',
  },
  gray: {
    background: 'bg-base-10',
    color: 'var(--color-base-dark)',
  },
  transparent: {
    background: '!bg-transparent',
    color: 'var(--color-base-90)',
  },
  border: {
    background: '!bg-base-20 !border !border-[#EFEFEF]',
    color: 'var(--color-base-90)',
  },
};

export const IconButton: React.FC<CombinedButtonProps & React.HTMLAttributes<HTMLButtonElement>> = ({
  className = '',
  onClick,
  type,
  variations = 'white',
  icon,
  imageSrc,
  disabled = false,
  ariaLabel,
  testId,
  ...rest
}) => {
  const { background, color } = VARIATION_STYLES[variations];

  const baseClasses = [
    'relative',
    'rounded-[3px]',
    'flex',
    'items-center',
    'justify-center',
    'transition-all',
    'duration-200',
    disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80',
    background,
    className,
  ].join(' ');

  const renderContent = () => {
    if (type === 'image' && imageSrc) {
      return (
        <Image
          width={20}
          height={20}
          className="w-5  object-cover"
          src={imageSrc}
          alt={ariaLabel}
          onError={() => <FallbackImage src={imageSrc} alt={ariaLabel} />}
        />
      );
    }

    if (type === 'icon' && icon) {
      return <Icon name={icon} color={color} size={20} />;
    }

    return null;
  };

  return (
    <button
      type="button"
      className={baseClasses}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      data-testid={testId}
      {...rest}
    >
      <div
        className={`flex items-center !rounded-[3px] justify-center w-[38px] h-[38px] ${disabled && '!cursor-not-allowed'}`}
      >
        {renderContent()}
      </div>
    </button>
  );
};
