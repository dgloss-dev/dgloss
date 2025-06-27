'use client';

import React from 'react';
import { App } from 'antd';
import { MessageType as AntMessageType } from 'antd/es/message/interface';
import { Button } from '../button';
import { ImageIcon } from '../icon';

type MessageContent = string | React.ReactNode;

interface MessageOptions {
  content: MessageContent;
  duration?: number;
  onClose?: () => void;
}

type MessageType = 'success' | 'error' | 'info' | 'warning' | 'loading';

export const useMessage = () => {
  const { message } = App.useApp();

  const showMessage = (type: MessageType, options: MessageOptions): AntMessageType => {
    const { content, duration, onClose } = options;

    switch (type) {
      case 'success':
        return message.success(content, duration, onClose);
      case 'error':
        return message.error(content, duration, onClose);
      case 'info':
        return message.info(content, duration, onClose);
      case 'warning':
        return message.warning(content, duration, onClose);
      case 'loading':
        return message.loading(content, duration, onClose);
      default:
        throw new Error('Invalid message type');
    }
  };

  return {
    success: (content: MessageContent, duration?: number, onClose?: () => void) =>
      showMessage('success', { content, duration, onClose }),
    error: (content: MessageContent, duration?: number, onClose?: () => void) =>
      showMessage('error', { content, duration, onClose }),
    info: (content: MessageContent, duration?: number, onClose?: () => void) =>
      showMessage('info', { content, duration, onClose }),
    warning: (content: MessageContent, duration?: number, onClose?: () => void) =>
      showMessage('warning', { content, duration, onClose }),
    loading: (content: MessageContent, duration?: number, onClose?: () => void) =>
      showMessage('loading', { content, duration, onClose }),
    destroy: message.destroy,
  };
};

interface MessageContentProps {
  children: React.ReactNode;
  onClose?: () => void;
  icon?: React.ReactNode;
}

export const MessageContent: React.FC<MessageContentProps> = ({ children, onClose, icon }) => (
  <>
    {icon}
    <span>{children}</span>
    {onClose && (
      <Button
        size="small"
        type="text"
        onClick={onClose}
        aria-label="Close"
        icon={<ImageIcon path="actions/close.svg" size={16} />}
      />
    )}
  </>
);
