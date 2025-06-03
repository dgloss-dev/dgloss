import React from 'react';
import AntBreadcrumb from 'antd/es/breadcrumb';
import ConfigProvider from 'antd/es/config-provider';

interface BreadcrumbProps {
  items: Array<{ href?: string; title?: string | React.ReactNode }>;
}
export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Breadcrumb: {
            linkColor: 'var(--color-link-light)',
            separatorColor: 'var(--color-text-light)',
          },
        },
      }}
    >
      <AntBreadcrumb
        items={items}
        className=" flex items-center md:max-h-[16px] font-NotoSansJP "
      />
    </ConfigProvider>
  );
};
