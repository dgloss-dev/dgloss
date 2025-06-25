import React from 'react';
import AntBreadcrumb from 'antd/es/breadcrumb';
import ConfigProvider from 'antd/es/config-provider';
import Image from 'next/image';

interface BreadcrumbProps {
  items: Array<{ href?: string; title?: string | React.ReactNode }>;
}
export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Breadcrumb: {
            linkColor: 'var(--color-base-light)',
            fontWeightStrong: 700,
            linkHoverColor: 'var(--color-base)',
            fontSize: 16,
          },
        },
      }}
    >
      <AntBreadcrumb
        items={items}
        className=" font-sans font-bold"
        separator={
          <Image
            src="/images/icons/rightArrow.svg"
            className="!max-w-none mt-[6px]"
            alt="rightArrow"
            width={10}
            height={16}
          />
        }
      />
    </ConfigProvider>
  );
};
