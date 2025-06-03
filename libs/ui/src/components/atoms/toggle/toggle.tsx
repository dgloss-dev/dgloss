import React from 'react';
import { Switch as AntSwitch, ConfigProvider } from 'antd';
import { SwitchProps as AntSwitchProps } from 'antd/es/switch';

export interface ToggleProps extends AntSwitchProps {
  checked?: boolean;
  className?: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  loading?: boolean;
  size?: 'small' | 'default';
  checkedChildren?: React.ReactNode;
  unCheckedChildren?: React.ReactNode;
  onChange?: (checked: boolean) => void;
  onClick?: (checked: boolean) => void;
  name?: string;
}

export const Toggle = ({ size = 'default', ...props }: ToggleProps) => {
  const themeConfig = {
    token: {
      colorPrimary: '#1677ff',
      colorText: 'rgba(0, 0, 0, 0.88)',
    },
    components: {
      Switch: {
        handleBg: '#fff',
        handleShadow: '0 2px 4px 0 rgba(0, 35, 11, 0.2)',
        handleSize: size === 'small' ? 12 : 18,
        trackHeight: size === 'small' ? 16 : 22,
        trackMinWidth: size === 'small' ? 28 : 44,
        trackPadding: 2,
        innerMaxMargin: size === 'small' ? 18 : 24,
        innerMinMargin: size === 'small' ? 6 : 9,
      },
    },
  };

  return (
    <ConfigProvider theme={themeConfig}>
      <AntSwitch className={`bg-gray-300 ${props.className}`} size={size} {...props} />
    </ConfigProvider>
  );
};
