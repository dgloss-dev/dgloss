import React, { CSSProperties } from 'react';
import AntDrawer from 'antd/es/drawer';
import { Button } from '../../atoms/button';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string | React.ReactNode;
  width?: number | string;
  height?: number | string;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  footer?: boolean | React.ReactNode;
  onCancel: () => void;
  onOk: () => void;
  loading?: boolean;
  size?: 'default' | 'large';
  children: React.ReactNode;
  className?: string;
  closeIcon?: boolean | React.ReactNode;
  extra?: React.ReactNode;
  mask?: boolean;
  maskClosable?: boolean;
  okText?: string;
  cancelText?: string;
  getContainer?: HTMLElement | (() => HTMLElement) | string | false;
  zIndex?: number;
  style?: CSSProperties;
}

export const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  title,
  onCancel,
  onOk,
  footer = true,
  okText = 'Save',
  cancelText = 'Cancel',
  getContainer = 'body',
  ...props
}) => {
  let footerComponent;

  if (typeof footer === 'boolean' && footer) {
    footerComponent = (
      <div className="flex justify-between items-center">
        <Button onClick={onCancel} label={cancelText} type="outlined" />
        <Button onClick={onOk} label={okText} />
      </div>
    );
  } else if (React.isValidElement(footer)) {
    footerComponent = footer;
  }

  return (
    <AntDrawer
      title={title}
      onClose={onClose}
      open={open}
      loading={props.loading}
      footer={footerComponent}
      closeIcon={true}
      getContainer={getContainer}
      {...props}
    >
      {props.children}
    </AntDrawer>
  );
};
