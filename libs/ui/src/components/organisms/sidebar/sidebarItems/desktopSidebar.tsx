'use client';

import React, { ReactElement } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sider } from '@workspace/ui/components/organisms/sider';
import { FallbackImage } from '@workspace/ui/components/atoms/fallbackImage';
import { ROUTES } from '@client/constants/routes.constant';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Header } from '@workspace/ui/components/organisms/header';
import { Footer } from '@workspace/ui/components/organisms/footer';

type MenuItem = {
  key: string;
  icon: string;
  label: string;
  show?: boolean;
  children?: MenuItem[];
};

type ListItem = {
  key: string;
  icon: ReactElement;
  label: ReactElement;
};

type SidebarProps = {
  isAdmin?: boolean;
  userEmail?: string;
  username?: string;
};

export const DesktopSidebar = ({ isAdmin = true, username = '佐藤敬子' }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = React.useState<'admin' | 'operator'>(isAdmin ? 'admin' : 'operator');

  const selectedKey = '/';

  const createMenuList = (items: MenuItem[], isChild = false): ListItem[] => {
    return items
      .filter((item) => item.show !== false)
      .map((item) => ({
        key: item.key,
        icon:
          item.children && item.children.length > 0 ? (
            <></>
          ) : (
            <FallbackImage
              src={`/images/icons/sidebar/${item.icon}.svg`}
              width={20}
              height={20}
              alt={item.label}
            />
          ),
        label: (
          <div
            className={`flex items-center w-full ${isChild ? 'justify-end' : 'justify-between'}`}
          >
            <h3
              className={`!text-[16px] ${item.children && item.children.length > 0 ? '!ml-0' : ''}`}
            >
              {item.label}
            </h3>
          </div>
        ),
        ...(item.children && item.children.length > 0
          ? { children: createMenuList(item.children, true) }
          : {}),
      }));
  };

  const useCreateMenuProps = (
    pathname: string,
    handleMenuClick: ({ key }: { key: string }) => void,
    isAdmin?: boolean,
  ) => {
    const getSelectedMenuKey = (path: string) => {
      const normalizedPath = path.replace(/\/$/, '');

      const menuItems = [
        ROUTES.USER_PDD,
        ROUTES.PUBLIC_PDD,
        ROUTES.OVERVIEW_USER_PDDS,
        ROUTES.ADMIN_ACCOUNT_MANAGEMENT,
        ROUTES.PROFILE,
        ROUTES.ONGOING,
        ROUTES.METHODOLOGIES,
        ROUTES.USER_PUBLIC_PDD,
        ROUTES.NOTICES,
        ROUTES.RATING_CATEGORY,
        ROUTES.CONDITIONS,
        ROUTES.EVALUATION_ITEMS,
        ROUTES.VALUATION_BASIS,
        ROUTES.CRITERIA,
      ];

      const matchedRoute = menuItems
        .sort((a, b) => b.length - a.length)
        .find((route) => normalizedPath.startsWith(route));

      return matchedRoute || normalizedPath;
    };

    const menuItems: MenuItem[] = [
      {
        key: ROUTES.MAIN,
        icon: 'home',
        label: `ホーム`,
        show: !isAdmin,
      },
      {
        key: ROUTES.PUBLIC_PDD,
        icon: 'users',
        label: `アカウント管理`,
        show: !isAdmin,
        children: [
          {
            key: ROUTES.ADMIN_ACCOUNT_MANAGEMENT,
            icon: 'users',
            label: `アカウント管理`,
          },
          {
            key: ROUTES.ADD_EVALUATION_ITEM,
            icon: 'users',
            label: `アカウント管理`,
          },
          {
            key: ROUTES.ADD_USER_PDD,
            icon: 'users',
            label: `アカウント管理`,
          },
        ],
      },
      {
        key: ROUTES.COMPARE_RESULTS,
        icon: 'briefCase',
        label: `プロジェクト管理`,
        show: !isAdmin,
      },
    ];

    const filteredMenuItems = menuItems.filter((item) => item.show !== false);
    const selectedKey = getSelectedMenuKey(pathname);

    return {
      selectedKeys: [selectedKey],
      openKeys: filteredMenuItems?.map((item) => item.key),
      items: createMenuList(menuItems, false),
      onClick: handleMenuClick,
      mode: 'inline' as const,
    };
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    console.log('key', key);
    router.push(key);
  };

  return (
    <div className="hidden h-screen  !max-w-[246px] md:flex flex-col items-start justify-between  ">
      <Sider
        header={<Header activeRole={role} onRoleChange={setRole} />}
        menuProps={useCreateMenuProps(pathname, handleMenuClick, isAdmin)}
        theme="light"
        footer={<Footer />}
        className="custom_sider "
        style={{
          background: '#433e3a',
          color: '#fff',
          borderRight: '1px solid #fff2',
          width: '246px',
        }}
      />
    </div>
  );
};
