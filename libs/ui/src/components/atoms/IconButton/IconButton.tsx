'use client';
import React from 'react';
import Image from 'next/image';
import classNames from 'classnames';

export interface IconButtonProps {
  text?: string;
  likedTextColor?: string;
  unlikedTextColor?: string;
  likedIconColor?: string;
  unlikedIconColor?: string;
  onClick?: () => void;
  className?: string;
  iconSrc?: string;
  altText?: string;
  textClassName?: string;
  iconSize?: number;
  heartIconWidth?: number;
  heartIconHeight?: number;
  isLiked?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  text,
  likedTextColor = '#ff3b30',
  unlikedTextColor = '#1e1f24',
  likedIconColor = '#ff3b30',
  unlikedIconColor = '#1e1f24',
  onClick,
  className,
  iconSrc,
  altText = 'icon',
  textClassName,
  iconSize = 20,
  heartIconWidth = 16,
  heartIconHeight = 16,
  isLiked = false,
}) => {
  const handleButtonClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const buttonClasses = classNames(
    'hover:bg-background-primary rounded-md py-[9px] px-2 bg-white border border-overlay-secondary justify-center items-center gap-1 inline-flex cursor-pointer',
    className,
  );

  const iconFillColor = isLiked ? likedIconColor : 'none';
  const iconStrokeColor = isLiked ? likedIconColor : unlikedIconColor;
  const textColor = isLiked ? likedTextColor : unlikedTextColor;

  return (
    <div className={buttonClasses} onClick={handleButtonClick}>
      <div className="flex items-center justify-center w-5 h-5">
        {iconSrc && (
          <Image
            src={iconSrc}
            alt={altText}
            width={iconSize}
            height={iconSize}
            style={{ fill: iconFillColor, stroke: iconStrokeColor }}
          />
        )}
      </div>
      {text && (
        <div className="justify-center items-center gap-2.5 flex" style={{ color: textColor }}>
          <div className={`text-base font-medium leading-tight text-center ${textClassName}`}>
            {text}
          </div>
        </div>
      )}
    </div>
  );
};
