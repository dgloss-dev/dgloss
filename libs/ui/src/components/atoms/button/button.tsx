import React from 'react';
import AntButton from 'antd/es/button';
import ConfigProvider from 'antd/es/config-provider';
import classNames from 'classnames';

export interface ButtonProps {
  type?: 'block' | 'dashed' | 'link' | 'text' | 'outlined';
  variant?:
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'neutral'
    | 'danger'
    | 'warning'
    | 'success'
    | 'custom'
    | 'responsive';
  size?: 'small' | 'middle' | 'large';
  shape?: 'default' | 'circle' | 'round';
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
  children?: React.ReactNode;
}

const getButtonClasses = (type: string, variant: string): string => {
  const baseClasses: Record<string, string> = {
    block:
      variant === 'primary'
        ? 'hover:!bg-primary-secondary !text-sm !font-medium h-10 px-4 py-2.5 !rounded-xl border border-overlay-secondary justify-center items-center gap-1.5 inline-flex text-sm font-medium leading-tight'
        : variant === 'secondary'
          ? '!bg-white !text-sm !font-medium h-10 px-4 !py-1 !border !border-overlay-secondary hover:!bg-overlay-primary hover:!text-black hover:!border-[#d1d1d5] !text-black'
          : variant === 'custom'
            ? '!bg-black !text-lg !font-medium h-10 !border !border-overlay-secondary !text-white transition-all duration-200 hover:!bg-gray-800 hover:!text-white hover:!border-gray-600'
            : variant === 'responsive'
              ? '!bg-white !text-lg !font-medium h-10 md:!border md:!border-overlay-secondary hover:!bg-overlay-primary hover:!text-black hover:!border-[#d1d1d5] !text-black'
              : `theme-bg--${variant} theme-bg-hover--${variant} ${
                  variant !== 'neutral' ? 'theme-text--white' : 'theme-text--base'
                }`,
    dashed: `theme-border--${variant} theme-border-hover--${variant} theme-text--${variant} theme-text-hover--${variant}`,
    outlined: `theme-border--${variant} theme-border-hover--${variant} theme-text--${variant} theme-text-hover--${variant}`,
    link: `theme-text--${variant} theme-text-hover--${variant}`,
    text: `theme-text--${variant} theme-text-hover--${variant} hover:!bg-transparent`,
    default: `theme-text--${variant} theme-text-hover--${variant}`,
  };
  return baseClasses[type] || baseClasses['default'];
};

export const Button = ({
  type = 'block',
  size = 'middle',
  fullWidth = false,
  disabled = false,
  variant = 'primary',
  htmlType = 'button',
  customClass = '',
  ...props
}: ButtonProps) => {
  const themeConfig = {
    token: {
      colorPrimary: variant === 'danger' ? '#FF3B30' : '#000000FF',
      fontSize: 14,
      fontWeight: 500,
      borderRadius: 6,
      borderRadiusSM: 4,
      controlHeight: 40,
      colorText: 'rgba(0, 0, 0, 0.88)',
      colorTextDisabled: 'rgba(0, 0, 0, 0.25)',
      colorBgContainer: '#ffffff',
      colorBorder: '#d9d9d9',
      paddingInline: 15,
      defaultShadow: 'none',
      primaryShadow: 'none',
    },
    components: {
      Button: {
        primaryColor: '#fff',
        primaryShadow: 'none',
        dangerColor: '#fff',
        dangerShadow: 'none',
        defaultColor: 'rgba(0, 0, 0, 0.88)',
        defaultBg: '#ffffff',
        defaultBorderColor: '#d9d9d9',
        defaultHoverColor: '#80bfff',
        defaultHoverBg: '#ffffff',
        defaultHoverBorderColor: '#80bfff',
        paddingInline: 16,
        paddingBlock: 10,
      },
    },
  };

  const buttonClasses = classNames(
    getButtonClasses(type, variant),
    'h-10 px-4 py-2.5 rounded-xl justify-center items-center gap-1.5 inline-flex text-sm font-medium leading-tight disabled:bg-neutral flex',
    customClass,
    props.className,
  );

  return (
    <ConfigProvider theme={themeConfig}>
      <AntButton
        className={buttonClasses}
        type={
          type === 'block'
            ? 'primary'
            : type === 'dashed'
              ? 'dashed'
              : type === 'link'
                ? 'link'
                : type === 'text'
                  ? 'text'
                  : 'default'
        }
        size={size}
        block={fullWidth}
        shape={props.shape}
        disabled={disabled}
        ghost={disabled}
        href={props.href}
        loading={props.loading}
        icon={props.icon}
        iconPosition={props.iconPosition}
        onClick={props.onClick}
        htmlType={htmlType}
      >
        {props.children || props.label}
      </AntButton>
    </ConfigProvider>
  );
};
