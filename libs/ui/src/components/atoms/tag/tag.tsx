import React from 'react';
import { Tag as AntTag, ConfigProvider } from 'antd';

interface TagProps {
  closable?: boolean;
  color?: string;
  icon?: React.ReactNode;
  label?: string;
  visible?: boolean;
  onClose?: () => void;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const Tag: React.FC<TagProps> = ({
  closable = false,
  color,
  icon,
  visible = true,
  className,
  style,
  label,
  children,
  onClose,
}) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#007aff',
          colorPrimaryHover: '#80bfff',
          colorPrimaryActive: '#007aff',
          colorBorder: '#d9d9d9',
          colorText: 'rgba(0, 0, 0, 0.88)',
          borderRadiusSM: 8,
        },
        components: {
          Tag: {
            fontSize: 14,
            colorFillSecondary: '#007aff',
            fontSizeSM: 14,
            lineHeight: 20,
            paddingXXS: 8,
            borderRadius: 4,
            marginXS: 8,
            // lineWidth: 2,
          },
        },
      }}
    >
      {label && <label className="block mb-2 text-sm font-semibold text-gray-600">{label}</label>}
      <AntTag
        closable={closable}
        color={color}
        icon={icon}
        visible={visible}
        onClose={onClose}
        className={className}
        style={style}
      >
        {children}
      </AntTag>
    </ConfigProvider>
  );
};
