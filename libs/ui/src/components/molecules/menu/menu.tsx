'use client';
import React, { CSSProperties, useState } from 'react';
import AntMenu from 'antd/es/menu';
import type { MenuProps as AntMenuProps, SubMenuProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';

type MenuItem = Required<AntMenuProps>['items'][number];

export interface MenuProps {
  items: MenuItem[];
  defaultSelectedKeys?: string[];
  defaultOpenKeys?: string[];
  mode?: 'vertical' | 'horizontal' | 'inline';
  width?: number | string;
  collapsed?: boolean;
  collapsedWidth?: number;
  openCurrentSubmenuOnly?: boolean;
  triggerSubMenuAction?: 'click' | 'hover';
  theme?: 'light' | 'dark';
  className?: string;
  expandIcon?: React.ReactNode | ((props: SubMenuProps & { isOpen: boolean }) => React.ReactNode);
  onClick?: AntMenuProps['onClick'];
  style?: CSSProperties;
  inlineCollapsed?: boolean;
  openKeys?: string[];
  onOpenChange?: any;
}

interface LevelKeysProps {
  key?: string;
  children?: LevelKeysProps[];
}
const getLevelKeys = (items1: LevelKeysProps[]) => {
  const key: Record<string, number> = {};
  const func = (items2: LevelKeysProps[], level = 1) => {
    items2?.forEach((item) => {
      if (item.key) {
        key[item.key] = level;
      }
      if (item.children) {
        func(item.children, level + 1);
      }
    });
  };
  func(items1);
  return key;
};

export const Menu: React.FC<MenuProps> = ({ items, mode = 'inline', expandIcon, ...props }) => {
  const levelKeys = getLevelKeys(items as LevelKeysProps[]);
  const [collapsed] = useState(props.collapsed || false);
  const [stateOpenKeys, setStateOpenKeys] = useState([] as string[]);
  let currentOpenKey: string | undefined = '';

  const onOpenChange: AntMenuProps['onOpenChange'] = (openKeys) => {
    if (!props.openCurrentSubmenuOnly) {
      setStateOpenKeys(openKeys);
      return;
    }
    currentOpenKey = openKeys.find((key) => stateOpenKeys.indexOf(key) === -1);
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter((key) => key !== currentOpenKey)
        .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey ?? '']);

      setStateOpenKeys(
        openKeys
          .filter((_, index) => index !== repeatIndex)
          .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey ?? '']),
      );
    } else {
      setStateOpenKeys(openKeys);
    }
  };

  const expandIconDown = (props: any) => {
    const isOpen = stateOpenKeys?.includes(props.eventKey as string);
    return <DownOutlined style={{ transform: `rotate(${isOpen ? 180 : 0}deg)` }} />;
  };

  return (
    <div
      style={{
        width: props.width,
      }}
      className='!px-4 py-4 !w-full !max-w-[246px]'
    >
      <AntMenu
        mode={mode}
        inlineCollapsed={collapsed}
        items={items}
        onOpenChange={onOpenChange}
        expandIcon={(subMenuProps) => {
          const isOpen = stateOpenKeys.includes(currentOpenKey ?? '');
          return expandIcon
            ? typeof expandIcon === 'function'
              ? expandIcon({ ...subMenuProps, isOpen })
              : expandIcon
            : expandIconDown({ ...subMenuProps, isOpen });
        }}
        {...props}
        className='custom_menu'
      />
    </div>
  );
};
