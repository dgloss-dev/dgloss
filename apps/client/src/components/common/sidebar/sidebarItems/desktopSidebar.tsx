'use client';

import React, { ReactElement } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sider } from '@workspace/ui/components/organisms/sider';
import { FallbackImage } from '@workspace/ui/components/atoms/fallbackImage';
import { ROUTES } from '@client/constants/routes.constant';
import { Header } from '@client/components/common/header/header';
import { Footer } from '@workspace/ui/components/organisms/footer';
import { useTranslations } from 'next-intl';
import { USER_ROLE } from '@workspace/types/enums/user';

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
  const [role, setRole] = React.useState<USER_ROLE>(
    isAdmin ? USER_ROLE.SUPERVISOR : USER_ROLE.OPERATOR,
  );
  const t = useTranslations('common');
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
          <div className={`flex items-center w-full ${isChild ? '' : 'justify-between'}`}>
            <h3
              className={`!text-[16px] !text-primary-light ${item.children && item.children.length > 0 ? '!ml-0' : ''}`}
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
    role: USER_ROLE,
  ) => {
    const getSelectedMenuKey = (path: string) => {
      const normalizedPath = path.replace(/\/$/, '');

      const menuItems = [
        ROUTES.ACCOUNT_MANAGEMENT,
        ROUTES.CALL_LIST,
        ROUTES.MY_LIST,
        ROUTES.TASK_MANAGEMENT,
        ROUTES.PROFILE,
        ROUTES.CALL_HISTORY,
        ROUTES.SETTING,
        ROUTES.INQUIRY,
      ];
      const matchedRoute = menuItems
        .sort((a, b) => b.length - a.length)
        .find((route) => normalizedPath.startsWith(route));

      return matchedRoute || normalizedPath;
    };

    // Define menu items for each role
    const adminMenuItems: MenuItem[] = [
      {
        key: ROUTES.HOME,
        icon: 'home',
        label: t('sidebar.home'),
      },
      {
        key: ROUTES.ACCOUNT_MANAGEMENT,
        icon: 'users',
        label: t('sidebar.accountManagement'),
      },
      {
        key: ROUTES.CALL_LIST,
        icon: 'callList',
        label: t('sidebar.callListManagement'),
      },
    ];

    const operatorMenuItems: MenuItem[] = [
      {
        key: ROUTES.HOME,
        icon: 'home',
        label: t('sidebar.home'),
      },
      {
        key: ROUTES.CALL_LIST_MANAGEMENT,
        icon: 'callList',
        label: t('sidebar.callListManagement'),
        children: [
          {
            key: ROUTES.CALL_LIST,
            icon: 'list',
            label: t('sidebar.callList'),
          },
          {
            key: ROUTES.MY_LIST,
            icon: 'myList',
            label: t('sidebar.myList'),
          },
        ],
      },

      {
        key: ROUTES.TASK_MANAGEMENT,
        icon: 'task',
        label: t('sidebar.taskManagement'),
      },
      {
        key: ROUTES.CALL_HISTORY,
        icon: 'callHistory',
        label: t('sidebar.callHistory'),
      },
      {
        key: ROUTES.SETTING,
        icon: 'setting',
        label: t('sidebar.setting'),
      },
      {
        key: ROUTES.INQUIRY,
        icon: 'inquiry',
        label: t('sidebar.inquiry'),
      },
    ];

    // Choose menu based on role
    const menuItems = role === USER_ROLE.SUPERVISOR ? adminMenuItems : operatorMenuItems;

    const selectedKey = getSelectedMenuKey(pathname);
    return {
      selectedKeys: [selectedKey],
      openKeys: menuItems?.map((item) => item.key),
      items: createMenuList(menuItems, false),
      onClick: handleMenuClick,
      mode: 'inline' as const,
    };
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    router.push(key);
  };

  return (
    <div className="hidden h-screen  !max-w-[246px] md:flex flex-col items-start justify-between  ">
      <Sider
        header={<Header t={t} activeRole={role} onRoleChange={setRole} />}
        menuProps={useCreateMenuProps(pathname, handleMenuClick, role)}
        theme="light"
        footer={<Footer t={t} />}
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
