import AntCheckbox from 'antd/es/checkbox';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import React from 'react';
import ConfigProvider from 'antd/es/config-provider';

interface BaseProps {
  type: 'single' | 'group';
}

export interface SingleProps extends BaseProps {
  type: 'single';
  label?: string;
  value?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (e: CheckboxChangeEvent) => void;
}

export interface GroupProps extends BaseProps {
  type: 'group';
  defaultValue?: string[];
  value?: string[];
  options: Array<{ label: string; value: string; disabled?: boolean }>;
  onChange?: (checkedValue: string[]) => void;
}

export type CheckboxProps = SingleProps | GroupProps;

export const Checkbox: React.FC<CheckboxProps> = ({ type = 'single', ...props }: CheckboxProps) => {
  const themeConfig = {
    token: {
      colorPrimary: '#1677ff',
      colorText: '#000000e0',
    },
    components: {
      Checkbox: {
        checkColor: 'var(--color-success)',
        checkBg: 'var(--color-success)',
        checkBorderColor: 'var(--color-success)',
        controlInteractiveSize: 20,
        controlHoverColor: 'var(--color-success)',
        hoverActiveColor: 'var(--color-success)',
        controlActiveColor: 'var(--color-success)',
        fontWeight: 400,
        fontSize: 14,
        lineWidth: 2,
        borderRadiusSM: 6,
        lineWidthBold: 2,
        lineWidthFocus: 2,
        height: 16,
        width: 16,
      },
    },
  };

  if (type === 'group') {
    const groupProps = props as GroupProps;
    return (
      <ConfigProvider theme={themeConfig}>
        <AntCheckbox.Group
          defaultValue={groupProps.defaultValue}
          options={groupProps.options}
          onChange={groupProps.onChange}
          value={groupProps.value}
          className="custom-checkbox"
        />
      </ConfigProvider>
    );
  }

  const { label, onChange, ...restProps } = props as SingleProps;
  return (
    <ConfigProvider theme={themeConfig}>
      <AntCheckbox
        onChange={onChange}
        {...restProps}
        className="custom-checkbox !font-NotoSansJP !font-[400] text-[13px] sm:!text-[15px]"
      >
        {label}
      </AntCheckbox>
    </ConfigProvider>
  );
};
