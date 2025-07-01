import React from 'react';
import { Tag as AntTag, ConfigProvider } from 'antd';

type TagType = 'active' | 'pause' | 'inActive' | 'custom';

interface CustomColors {
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
}

interface TagProps {
  type?: TagType;
  closable?: boolean;
  icon?: React.ReactNode;
  label?: string;
  visible?: boolean;
  onClose?: () => void;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  // Custom colors for custom type
  customColors?: CustomColors;
}

const getTagTheme = (type: TagType, customColors?: CustomColors) => {
  const baseTheme = {
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 400,
    paddingInline: 8,
    paddingBlock: 2,
  };

  switch (type) {
    case 'active':
      return {
        ...baseTheme,
        colorBgContainer: '#E6F4FF',
        colorBorder: '#91CAFF',
        colorText: '#1677FF',
      };
    case 'pause':
      return {
        ...baseTheme,
        colorBgContainer: '#F6FFED',
        colorBorder: '#B7EB8F',
        colorText: '#52C41A',
      };
    case 'inActive':
      return {
        ...baseTheme,
        colorBgContainer: '#FFFFFF',
        colorBorder: '#00000026',
        colorText: '#00000040',
      };
    case 'custom':
      return {
        ...baseTheme,
        colorBgContainer: customColors?.backgroundColor || '#f0f0f0',
        colorBorder: customColors?.borderColor || '#d9d9d9',
        colorText: customColors?.textColor || '#000000',
      };
    default:
      return baseTheme;
  }
};

export const Tag: React.FC<TagProps> = ({
  type = 'active',
  closable = false,
  icon,
  visible = true,
  className,
  style,
  label,
  children,
  onClose,
  customColors,
}) => {
  const tagTheme = getTagTheme(type, customColors);

  return (
    <ConfigProvider
      theme={{
        token: {
          fontSize: 12,
          fontFamily: 'var(--font-sf-pro)',
          fontSizeLG: 12,
          fontSizeSM: 12,
          borderRadius: 4,
        },
        components: {
          Tag: tagTheme,
        },
      }}
    >
      {label && <label className="block mb-2 text-sm font-semibold text-gray-600">{label}</label>}
      <AntTag
        closable={closable}
        icon={icon}
        onClose={onClose}
        className={`custom_ant_tag ${className}`}
      
      >
        {children}
      </AntTag>
    </ConfigProvider>
  );
};
