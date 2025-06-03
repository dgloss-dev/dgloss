import React from 'react';
import { Radio as AntRadio, ConfigProvider } from 'antd';
import { RadioChangeEvent } from 'antd/es/radio';

export interface BaseProps {
  optionType: 'button' | 'default';
  radioType?: 'group' | 'single';
  options?: Array<{
    label: string | React.ReactNode;
    value: string;
    disabled?: boolean;
  }>;
  defaultValue?: string;
  disabled?: boolean;
  name?: string;
  value?: string;
  onChange?: (e: RadioChangeEvent) => void;
  onClick?: React.MouseEventHandler<HTMLElement>;
  checked?: boolean;
  className?: string;
  label?: string;
}

export interface RadioGroupProps {
  children: React.ReactNode;
  value?: string;
  onChange?: (e: RadioChangeEvent) => void;
  onClick?: React.MouseEventHandler<HTMLElement>;
  className?: string;
  checked?: boolean;
}

export interface RadioButtonProps extends BaseProps {
  optionType: 'button';
  radioType: 'group';
  buttonStyle?: 'solid' | 'outline';
  size?: 'small' | 'middle' | 'large';
  checked?: boolean;
  className?: string;
}

export type RadioProps = BaseProps | RadioButtonProps;

export const Radio = ({
  optionType = 'default',
  radioType = 'group',
  options,
  label,
  ...props
}: RadioProps) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#007aff',
          controlOutlineWidth: 8,
        },
        components: {
          Radio: {
            buttonCheckedBg: '#3f51b5',
            buttonBg: '#3f51b5',
            buttonColor: '#fff',
            dotSize: 8,
            lineWidth: 2,
            lineWidthFocus: 2,
            radioSize: 18,
          },
        },
      }}
    >
      <div className="mb-4">
        {radioType === 'single' ? (
          <AntRadio {...props}>{label}</AntRadio>
        ) : (
          <AntRadio.Group
            options={options}
            optionType={optionType}
            buttonStyle={(props as RadioButtonProps).buttonStyle}
            size={(props as RadioButtonProps).size}
            className={`${props.className}`} // Custom Tailwind styling
            {...props}
          />
        )}
      </div>
    </ConfigProvider>
  );
};

export const RadioGroup = ({ children, ...props }: RadioGroupProps) => {
  return <AntRadio.Group {...props}>{children}</AntRadio.Group>;
};

export type { RadioChangeEvent };
