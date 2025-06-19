'use client';

import React from 'react';
import { Layout, ConfigProvider, ThemeConfig } from 'antd';

import { Menu, MenuProps } from '../../molecules/menu';

interface SiderProps {
  width?: number | string;
  className?: string;
  menuProps: MenuProps;
  theme?: 'light' | 'dark';
  header?: React.ReactNode;
  footer?: React.ReactNode;
  paddingtop?: boolean;
  style?: React.CSSProperties;
}

const { Sider: AntSider } = Layout;

export const Sider: React.FC<SiderProps> = ({
  width = 246,
  theme = 'light',
  menuProps,
  ...props
}) => {
  const siderStyle = {
    height: '100vh',
    borderRight: '1px solid var(--color-base-30)',
    ...props.style,
  };

  const customTheme: ThemeConfig = {
    token: {
      colorPrimary: 'var(--color-primary-dark)',
      colorBgContainer: 'var(--color-primary-dark)',
    },
    components: {
      Menu: {
        itemHoverBg: 'var(--color-accent)',
        itemHoverColor: 'var(--color-primary-light)',
        itemSelectedBg: 'var(--color-primary-20)',
        itemSelectedColor: 'var(--color-primary-dark)',
        itemActiveBg: 'var(--color-primary-20)',
        fontSize: 14,
        fontWeightStrong: 700,
        itemColor: 'var(--color-primary-light)',
        itemHeight: 40,
        activeBarBorderWidth: 0,
      },
    },
  };

  return (
    <ConfigProvider theme={customTheme}>
      <Layout>
        <AntSider width={width} theme={theme} style={siderStyle} {...props}>
          <div className={props.paddingtop ? '' : ''}>
            {props.header}
            <Menu className="" theme={theme} {...menuProps} />
          </div>
          <div className="pb-5 w-full flex items-center justify-center">{props.footer}</div>
        </AntSider>
      </Layout>
    </ConfigProvider>
  );
};
