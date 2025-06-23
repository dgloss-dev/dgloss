'use client';
import React from 'react';
import AntModal from 'antd/es/modal';
import ConfigProvider from 'antd/es/config-provider';
import { Button } from '@workspace/ui/components/atoms/button';
import { ImageIcon } from '../../atoms/icon';
import { useTranslations } from 'next-intl';

interface ModalProps {
  open: boolean;
  closeIcon?: React.ReactNode;
  title?: React.ReactNode;
  onCancel?: () => void;
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
  okType?: 'info' | 'success' | 'error' | 'warning' | 'confirm';
  buttonLoading?: boolean;
  showFooter?: boolean;
  hideCancelButton?: boolean;
}

export const Modal: React.FC<ModalProps> & {
  info: typeof AntModal.info;
  success: typeof AntModal.success;
  error: typeof AntModal.error;
  warning: typeof AntModal.warning;
  confirm: typeof AntModal.confirm;
} = ({
  open,
  title,
  onCancel,
  onOk,
  centered = true,
  style,
  okText,
  cancelText,
  showFooter = true,
  hideCancelButton = false,
  ...props
}) => {
  const customFooter = ({
    onOk,
    onCancel,
    t,
  }: {
    onOk?: () => void;
    onCancel?: () => void;
    t: any;
  }) => {
    const cancelText = t('buttons.cancel');
    const okText = t('buttons.submit');
    return (
      <div className="flex items-center gap-x-2 justify-center w-full">
        {!hideCancelButton && (
          <Button
            type="block"
            variant="primary-outline"
            label={cancelText}
            onClick={onCancel}
            className="!w-full !max-w-[128px]"
          />
        )}

        <Button
          type="block"
          variant="warning"
          label={okText}
          onClick={onOk}
          loading={props.buttonLoading}
          className="!w-full !max-w-[128px]"
        />
      </div>
    );
  };
  const t = useTranslations('common');
  return (
    <ConfigProvider
      theme={{
        components: {
          Modal: {
            boxShadow: '0px 4px 12px 0px #00000026',
            borderRadius: 4,
            titleColor: 'var(--color-base)',
            titleFontSize: 20,
            fontWeightStrong: 700,
            fontFamily: 'var(--font-sf-pro)',
            padding: 24,
            paddingLG: 24,
            paddingMD: 24,
            paddingSM: 24,
            paddingXS: 24,
            paddingXXS: 24,
            titleLineHeight: 2,
          },
        },
      }}
    >
      <AntModal
        open={open}
        title={title}
        onCancel={onCancel}
        onOk={onOk}
        centered={centered}
        className={props.className}
        closeIcon={
          <ImageIcon
            path="actions/close.svg"
            size={18}
            className="!max-w-none  hover:bg-none !mt-3"
          />
        }
        {...props}
        style={{ borderRadius: '1rem', ...style }}
        okText={okText ? okText : t('buttons.submit')}
        cancelText={cancelText ? cancelText : t('buttons.cancel')}
        width={800}
        footer={showFooter ? customFooter({ onOk, onCancel, t }) : <></>}
        okType="danger"
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
