import React from 'react';
import { Segmented, ConfigProvider } from 'antd';

interface IKeyValueOption {
  label: string;
  value: string;
}

type SegmentedType = {
  options: string[] | IKeyValueOption[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  size?: 'small' | 'middle' | 'large';
  className?: string;
  name?: string;
  value?: any;
  justifyBetween?: boolean;
};

export const SegmentedControl = ({
  options,
  name,
  defaultValue,
  onChange,
  disabled = false,
  size = 'middle',
  className,
  value,
  justifyBetween = false,
}: SegmentedType) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Segmented: {
            itemActiveBg: 'rgba(0, 0, 0, 0.15)',
            itemColor: 'rgba(0, 0, 0, 0.65)',
            itemHoverBg: 'rgba(0, 0, 0, 0.06)',
            itemHoverColor: 'rgba(0, 0, 0, 0.88)',
            itemSelectedBg: '#ffffff',
            itemSelectedColor: 'rgba(0, 0, 0, 0.88)',
            // trackBg: '#f5f5f5',
            trackPadding: 4,
            borderRadiusXS: 6,
            borderRadius: 8,
            controlHeight: 32,
            fontSize: 14,
          },
        },
      }}
    >
      <div
        className={`overflow-x-auto rounded-xl scrollbar-hide ${
          justifyBetween ? 'flex justify-between' : ''
        }`}
      >
        <Segmented
          name={name}
          className={`${className} whitespace-nowrap`}
          options={options}
          defaultValue={defaultValue}
          onChange={onChange}
          disabled={disabled}
          size={size}
          value={value}
        />
      </div>
    </ConfigProvider>
  );
};
