import React, { useMemo } from 'react';
import AntButton from 'antd/es/button';
import ConfigProvider from 'antd/es/config-provider';
import classNames from 'classnames';

export type ButtonType = 'block' | 'dashed' | 'link' | 'text' | 'outlined';
export type ButtonVariant =
  | 'primary'
  | 'primary-outline'
  | 'secondary'
  | 'tertiary'
  | 'quaternary'
  | 'warning';
export type ButtonSize = 'small' | 'middle' | 'large';
export type ButtonShape = 'default' | 'circle' | 'round';

export interface ButtonProps {
  type?: ButtonType;
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  label?: string;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  customClass?: string;
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  href?: string;
  htmlType?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  onKeyPress?: (e?: any) => void;
  children?: React.ReactNode;
}

const getFontSize = (size: ButtonSize): string => {
  const sizes: Record<ButtonSize, string> = {
    small: '!text-[13px]',
    middle: '!text-[14px]',
    large: '!text-[15px]',
  };
  return sizes[size];
};

const getButtonClasses = (type: ButtonType, variant: ButtonVariant, size: ButtonSize): string => {
  const fontSize = getFontSize(size);

  const heightClasses = {
    small: '!h-[30px]',
    middle: '!h-[32px]',
    large: '!h-[34px]',
  };

  const paddingClasses = {
    small: '!py-[5px] !px-[10px]',
    middle: '!py-[5px] !px-[15px]',
    large: '!py-[8px] !px-[18px]',
  };

  const variantClasses: Record<ButtonVariant, string> = {
    primary: `!font-normal !bg-success disabled:!bg-success/50 !text-primary-light hover:!bg-success/80 !shadow-primary ${heightClasses[size]} ${fontSize}`,
    'primary-outline': `!font-normal !bg-primary-light disabled:!bg-primary-light/50 !text-base hover:!bg-primary-light/80 !border-[1px] !shadow-primary-outline !border-dust ${heightClasses[size]} ${fontSize}`,
    secondary: `!font-normal !bg-neutral disabled:!bg-neutral/50  !text-primary-light hover:!bg-neutral/80  !shadow-secondary ${heightClasses[size]} ${fontSize}`,
    tertiary: `!font-normal !bg-base-10 disabled:!bg-base-10/50 !text-base hover:!text-primary hover:!bg-primary-20 ${heightClasses[size]} ${fontSize}`,
    quaternary: `!font-normal !bg-transparent disabled:!bg-transparent/50 !text-base-dark hover:!text-primary hover:!bg-primary-20 ${heightClasses[size]} ${fontSize}`,
    warning: `!font-normal !bg-warning disabled:!bg-warning/50 !text-primary-light  hover:!bg-warning/80 !shadow-warning ${heightClasses[size]} ${fontSize}`,
  };

  const typeClasses: Record<ButtonType, string> = {
    block: variantClasses[variant],
    dashed: `theme-border--${variant} theme-border-hover--${variant} theme-text--${variant} theme-text-hover--${variant} ${heightClasses[size]} ${fontSize}`,
    outlined: `theme-border--${variant} theme-border-hover--${variant} theme-text--${variant} theme-text-hover--${variant} ${heightClasses[size]} ${fontSize}`,
    link: `theme-text--${variant} theme-text-hover--${variant} ${fontSize}`,
    text: `theme-text--${variant} theme-text-hover--${variant} hover:!bg-transparent ${fontSize}`,
  };

  return `${typeClasses[type]}  ${paddingClasses[size]}`;
};

export const Button = React.memo(
  ({
    type = 'block',
    size = 'middle',
    fullWidth = false,
    disabled = false,
    variant = 'primary',
    htmlType = 'button',
    customClass = '',
    ...props
  }: ButtonProps) => {
    const buttonClasses = useMemo(
      () =>
        classNames(
          getButtonClasses(type, variant, size),
          ' !z-10 !font-sans relative',
          customClass,
          props.className,
        ),
      [type, variant, size, customClass, props.className],
    );

    const configTheme = useMemo(
      () => ({
        token: {
          fontWeightStrong: 400,
          borderRadius: 6,
          borderRadiusSM: 4,
          controlHeight: 40,
        },
        components: {
          Button: {
            contentFontSize: 14,
            contentFontSizeLG: 14,
            fontWeight: 700,
            contentFontSizeSM: 14,
            primaryShadow: 'none',
            paddingInline: 8,
            paddingBlockSM: 10,
            paddingBlock: 11,
            paddingBlockLG: 13,
          },
        },
      }),
      [],
    );

    const buttonType = useMemo(() => {
      const types: Record<ButtonType, any> = {
        block: 'primary',
        dashed: 'dashed',
        link: 'link',
        text: 'text',
        outlined: 'default',
      };
      return types[type];
    }, [type]);

    return (
      <ConfigProvider theme={configTheme}>
        <AntButton
          className={buttonClasses}
          type={buttonType}
          block={fullWidth}
          shape={props.shape}
          size={size}
          disabled={disabled}
          ghost={disabled}
          href={props.href}
          loading={props.loading}
          icon={props.icon}
          onClick={props.onClick}
          htmlType={htmlType}
          onKeyDown={props.onKeyPress}
        >
          {props.children || <h3 className=" z-[10] !w-full  !font-normal">{props.label}</h3>}
        </AntButton>
      </ConfigProvider>
    );
  },
);

Button.displayName = 'Button';
