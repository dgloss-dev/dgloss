'use client';
import React, { useState } from 'react';
import AntDropdown from 'antd/es/dropdown';
import { MenuProps } from 'antd/es/menu';
import ConfigProvider from 'antd/es/config-provider';
import { Button, ButtonProps } from '../button';
import { ItemType, MenuItemType, SubMenuType } from 'antd/es/menu/interface';
import Image from 'next/image';
import { getCDNUrl } from '../../../utils/url';

export interface DropdownProps {
  items?: ItemType[] | SubMenuType[];
  menu?: MenuProps;
  placement?: 'bottomLeft' | 'bottomCenter' | 'bottomRight' | 'topLeft' | 'topCenter' | 'topRight';
  trigger?: ('click' | 'hover')[];
  triggerType?: 'text' | 'button' | 'custom';
  triggerText?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  buttonProps?: ButtonProps;
  autoFocus?: boolean;
  selectable?: boolean;
  defaultSelectedKeys?: string[];
  onOpenChange?: (visible: boolean) => void;
  onClick?: MenuProps['onClick'];
  className?: string;
  overlayClassName?: string;
  showIcon?: boolean;
  menuClassName?: string;
  triggerTextShow?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
  placement = 'bottomLeft',
  trigger = ['hover'],
  triggerType = 'text',
  items,
  triggerText,
  showIcon = true,
  triggerTextShow,
  ...props
}: DropdownProps) => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const selectedItem = items?.find((item) => item && 'key' in item && item.key === selectedKey);
  const displayText =
    selectedItem && 'label' in selectedItem ? String(selectedItem.label) : triggerText;

  const handleClick: MenuProps['onClick'] = (info) => {
    setSelectedKey(info.key);
    if (props.onClick) {
      props.onClick(info);
    }
  };

  let child;
  if (triggerType === 'text') {
    child = (
      <div
        className="h-10 px-4 py-2.5 bg-white rounded-xl border border-overlay-secondary justify-center items-center gap-1 inline-flex cursor-pointer hover:bg-background-secondary"
        onClick={(e) => e.preventDefault()}
      >
        {!triggerTextShow ? displayText : triggerText}
        {showIcon && (
          <Image
            src={getCDNUrl('/icons/Arrow-Down.small.svg')}
            alt="ArrowDownSmall"
            width={16}
            height={16}
          />
        )}
      </div>
    );
  } else if (triggerType === 'button') {
    child = (
      <>
        {!triggerTextShow ? (
          <Button label={props.buttonProps?.label || displayText} {...props.buttonProps}></Button>
        ) : (
          <Button label={props.buttonProps?.label || triggerText} {...props.buttonProps}></Button>
        )}
      </>
    );
  } else if (triggerType === 'custom') {
    child = props.children;
  }

  const itemsWithIcons: ItemType[] | undefined = items?.map((item) => {
    if (item && 'label' in item && 'key' in item && item.key) {
      return {
        ...item,
        label: (
          <div className="flex items-center justify-between w-full h-5 gap-8 grow shrink basis-0">
            <span className="pr-20">{item.label}</span>
            {selectedKey === item.key && (
              <Image
                src={getCDNUrl('/icons/Checkmark.svg')}
                alt="Checkmark"
                width={16}
                height={16}
              />
            )}
          </div>
        ),
      } as MenuItemType;
    }
    return item;
  });

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#007aff',
          controlOutlineWidth: 8,
        },
        components: {
          Radio: {
            buttonCheckedBg: '#FF0000',
            buttonBg: '#FF0000',
            buttonColor: '#fff',
          },
          Dropdown: {
            paddingBlock: 5,
            zIndexPopup: 1050,
            colorBgElevated: '#ffffff',
            colorPrimary: '#1677ff',
          },
        },
      }}
    >
      <AntDropdown
        menu={{
          items: itemsWithIcons,
          onClick: handleClick,
          selectable: props.selectable,
          defaultSelectedKeys: props.defaultSelectedKeys,
          className: props.menuClassName,
        }}
        trigger={trigger}
        placement={placement}
        overlayClassName={`border border-gray-300 ${props.overlayClassName}`}
        {...props}
      >
        {child}
      </AntDropdown>
    </ConfigProvider>
  );
};
