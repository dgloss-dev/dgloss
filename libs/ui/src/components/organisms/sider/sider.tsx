'use client';
import React from 'react';
import { Layout } from 'antd';
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

export const Sider: React.FC<SiderProps> = ({ width = 256, theme = 'light', ...props }) => {
  const siderStyle = {
    height: '100vh',
    borderRight: '1px solid #f0f0f0',
    ...props.style,
  };

  return (
    <Layout>
      <AntSider width={width} theme={theme} style={siderStyle} {...props}>
        {props.header}
        <div className={props.paddingtop ? 'pt-24' : ''}>
          <Menu theme={theme} {...props.menuProps} />
        </div>
        {props.footer}
      </AntSider>
    </Layout>
  );
};
