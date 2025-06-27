import React from 'react';
import ConfigProvider from 'antd/es/config-provider';
import App from 'antd/es/app';

type Props = {
  children: React.ReactNode;
};

export const AntdConfigProvider = ({ children }: Props) => {
  const THEME = {
    token: {
      colorPrimary: 'var(--color-primary-default)',
      colorLink: 'var(--color-primary-default)',
      colorText: 'var(--color-text-light)',
      colorPrimaryHover: 'var(--color-primary-default)',
      controlOutlineWidth: 1,
      borderRadiusLG: 4,
      borderRadiusSM: 2,
    },
  };

  return (
    <ConfigProvider theme={THEME}>
      <App>{children}</App>
    </ConfigProvider>
  );
};