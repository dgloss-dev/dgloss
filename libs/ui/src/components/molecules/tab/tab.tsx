import React from 'react';
import { Tabs as AntTabs, ConfigProvider } from 'antd';

interface TabProps {
  items: {
    key: string;
    label: React.ReactNode;
    children: React.ReactNode;
    disabled?: boolean;
    icon?: React.ReactNode;
  }[];
  defaultActiveKey?: string;
  centered?: boolean;
  onChange?: (key: string) => void;
  tabPosition?: 'top' | 'right' | 'bottom' | 'left';
  type?: 'line' | 'card';
  size?: 'small' | 'middle' | 'large';
  animated?: { inkBar: boolean; tabPane: boolean };
  className?: string;
  activeKey?: string;
}

export const Tabs: React.FC<TabProps> = ({
  items,
  defaultActiveKey = '1',
  type = 'line',
  tabPosition = 'top',
  size = 'middle',
  animated = { inkBar: true, tabPane: true },
  className,
  ...props
}) => {
  // const combinedClassName = `custom-tabs ${className || ''}`.trim();

  return (
    <ConfigProvider
      theme={{
        components: {
          Tabs: {
            cardBg: 'rgba(0, 0, 0, 0.02)',
            cardGutter: 2,
            cardHeight: 40,
            cardPadding: '8px 16px',
            horizontalMargin: '0 0 24px 0',
            cardPaddingLG: '8px 16px 6px',
            cardPaddingSM: '6px 16px',
            horizontalItemGutter: 24,
            horizontalItemMargin: '0 0 16px 0',
            horizontalItemPadding: '16px 0',
            horizontalItemPaddingLG: '16px 0',
            horizontalItemPaddingSM: '8px 0',
            inkBarColor: '#1E1F24',
            itemActiveColor: '#1E1F24',
            itemColor: 'rgba(0, 0, 0, 0.88)',
            itemHoverColor: '#9ca3af',
            itemSelectedColor: '#1E1F24',
            titleFontSize: 14,
            titleFontSizeLG: 14,
            titleFontSizeSM: 14,
            verticalItemMargin: '16px 0 0 0',
            verticalItemPadding: '8px 24px',
            zIndexPopup: 1050,
          },
        },
      }}
    >
      <AntTabs
        defaultActiveKey={defaultActiveKey}
        className={className}
        items={items}
        type={type}
        tabPosition={tabPosition}
        size={size}
        animated={animated}
        // className={combinedClassName}
        {...props}
      />
    </ConfigProvider>
  );
};
