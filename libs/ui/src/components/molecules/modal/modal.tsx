import React from 'react';
import AntModal from 'antd/es/modal';
import ConfigProvider from 'antd/es/config-provider';

interface ModalProps {
  open: boolean;
  closeIcon?: React.ReactNode;
  title?: React.ReactNode;
  onCancel: () => void;
  onOk?: () => void;
  footer?: React.ReactNode;
  okText?: string;
  cancelText?: string;
  confirmLoading?: boolean;
  closable?: boolean;
  centered?: boolean;
  loading?: boolean;
  style?: React.CSSProperties;
  width?: number;
  afterClose?: () => void;
  wrapClassName?: string;
  destroyOnClose?: boolean;
  mask?: boolean;
  maskClosable?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> & {
  info: typeof AntModal.info;
  success: typeof AntModal.success;
  error: typeof AntModal.error;
  warning: typeof AntModal.warning;
  confirm: typeof AntModal.confirm;
} = ({ open, title, onCancel, onOk, centered = true, style, ...props }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          screenXSMax: 480,
          screenSMMin: 480,
        },
      }}
    >
      <AntModal
        open={open}
        title={title}
        onCancel={onCancel}
        onOk={onOk}
        centered={centered}
        {...props}
        style={{ borderRadius: '1rem', ...style }}
      >
        {props.children}
      </AntModal>
    </ConfigProvider>
  );
};

Modal.info = AntModal.info;
Modal.success = AntModal.success;
Modal.error = AntModal.error;
Modal.warning = AntModal.warning;
Modal.confirm = AntModal.confirm;
