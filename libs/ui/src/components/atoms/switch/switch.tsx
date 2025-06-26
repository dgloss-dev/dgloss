import React, { useMemo } from 'react';
import AntSwitch from 'antd/es/switch';
import ConfigProvider from 'antd/es/config-provider';
import classNames from 'classnames';

export interface SwitchProps {
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  customClass?: string;
  onChange?: (checked: boolean) => void;
  checkedChildren?: React.ReactNode;
  unCheckedChildren?: React.ReactNode;
}

const baseClasses = '!w-[40px] !h-[20px] !min-w-[40px] disabled:!opacity-40';
export const Switch = React.memo(
  ({
    disabled = false,
    loading = false,
    customClass = '',
    onChange,
    checkedChildren,
    unCheckedChildren,
    className,
  }: SwitchProps) => {
    const switchClasses = useMemo(
      () => classNames(baseClasses, customClass, className),
      [disabled, customClass, className],
    );

    return (
      <ConfigProvider
        theme={{
          token: {
            borderRadius: 10,
            colorPrimary: '#1677ff',
            colorPrimaryHover: '#1677ff',
          },
          components: {
            Switch: {
              handleSize: 16,
              trackHeight: 22,
              trackHeightSM:22,
              trackMinWidth: 44,
              controlHeight: 22,
            },
          },
        }}
      >
        <AntSwitch
          className={switchClasses}
          disabled={disabled}
          loading={loading}
          onChange={onChange}
          checkedChildren={checkedChildren}
          unCheckedChildren={unCheckedChildren}
        />
      </ConfigProvider>
    );
  },
);

Switch.displayName = 'Switch';
