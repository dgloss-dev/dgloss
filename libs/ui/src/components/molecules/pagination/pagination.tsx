import React from 'react';
import AntdPagination from 'antd/es/pagination';
import ConfigProvider from 'antd/es/config-provider';

type PaginationType = {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
  showQuickJumper?: boolean;
  showPrevNextJumpers?: boolean;
  itemRender?: any;
  showSizeChanger?: boolean;
};

export const Pagination = (props: PaginationType) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Pagination: {
            itemActiveBg: '#ffff', // Background color of active item
            itemActiveBgDisabled: '#00000040', // Background of disabled active item
            itemActiveColorDisabled: "#00000040", // Text color of disabled active item
            itemBg: 'undefined', // Background color of Pagination item
            itemInputBg: '#ffffff', // Background color of input
            itemLinkBg: '#ffffff', // Background color of Pagination item link
            itemSize: 32, // Size of Pagination item
            itemSizeSM: 24, // Size of small Pagination item
            miniOptionsSizeChangerTop: 0, // Top of Pagination size changer
            colorBgContainer: '#ffffff', // Background color for containers
            colorBgContainerDisabled: 'rgba(0, 0, 0, 0.04)', // Disabled container background
            colorBgTextActive: 'rgba(0, 0, 0, 0.15)', // Active text background
            colorBgTextHover: 'rgba(0, 0, 0, 0.06)', // Hover text background
            colorBorder: '#d9d9d9', // Default border color
            colorPrimary: '#000000E0', // Primary color
            colorPrimaryBorder: '#000000E0', // Primary border color
            colorPrimaryHover: '#000000E0', // Primary hover color
            colorText: 'rgba(0, 0, 0, 0.88)', // Default text color
            colorTextDisabled: 'rgba(0, 0, 0, 0.25)', // Disabled text color
            colorTextPlaceholder: 'rgba(0, 0, 0, 0.25)', // Placeholder text color
            borderRadius: 6, // Border radius
            borderRadiusLG: 6, // Large border radius
            borderRadiusSM: 6, // Small border radius
            controlHeight: 32, // Control height
            controlHeightLG: 40, // Large control height
            controlHeightSM: 24, // Small control height
            controlOutline: 'rgba(5, 145, 255, 0.1)', // Control outline color
            controlOutlineWidth: 2, // Control outline width
            fontSize: 14, // Default font size
            fontSizeSM: 12, // Small font size
            fontWeightStrong: 600, // Strong font weight
            lineHeight: 1.5714285714285714, // Line height
            lineHeightLG: 1.5, // Large line height
            lineType: 'solid', // Border style
            lineWidth: 1, // Border width
            lineWidthFocus: 4, // Focus border width
            margin: 16, // Default margin
            marginSM: 12, // Small margin
            marginXS: 8, // Extra small margin
            marginXXS: 4, // Extra extra small margin
            motionDurationMid: '0.2s', // Medium motion duration
            motionDurationSlow: '0.3s', // Slow motion duration
            paddingXXS: 4, // Extra extra small padding
            screenLG: 992, // Large screen width
            screenSM: 576, // Small screen width
          },
        },
      }}
    >
      <AntdPagination
        current={props.current}
        total={props.total}
        pageSize={props.pageSize}
        onChange={props.onChange}
        showQuickJumper={props.showQuickJumper}
        showPrevNextJumpers={props.showPrevNextJumpers}
        itemRender={props.itemRender}
        showSizeChanger={props.showSizeChanger}
      />
    </ConfigProvider>
  );
};
